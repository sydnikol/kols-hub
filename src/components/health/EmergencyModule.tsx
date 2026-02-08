import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Phone,
  Heart,
  Shield,
  Activity,
  Pill,
  FileText,
  Clock,
  ChevronDown,
  ChevronUp,
  Printer,
  Users,
  Brain,
  Wind,
  AlertCircle,
  Check,
  Plus,
  Trash2,
  Calendar,
  MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  PATIENT_INFO,
  VITAL_STATS,
  EMERGENCY_INFO,
  POTS_EPISODE_PROTOCOL,
  PSYCHOSOCIAL_CONSIDERATIONS,
  COMPLETE_MEDICATIONS
} from '../../data/sydney-complete-health-profile';

// ===== INTERFACES =====
interface CrisisDebrief {
  id: string;
  date: string;
  type: 'pots' | 'freeze' | 'asthma' | 'other';
  duration: string;
  triggers: string;
  whatHelped: string;
  whatDidntHelp: string;
  notes: string;
  severity: 1 | 2 | 3 | 4 | 5;
}

// ===== EMERGENCY CONTACTS WITH PHONE NUMBERS =====
const EMERGENCY_CONTACTS = [
  { name: 'Quincy', relationship: 'Partner', phone: '', priority: 1, color: 'pink' },
  { name: "Da'Veon", relationship: 'Partner', phone: '', priority: 2, color: 'purple' },
  { name: 'Mary Jones', relationship: 'Mother', phone: '913-638-8640', priority: 3, color: 'blue' },
  { name: '911', relationship: 'Emergency Services', phone: '911', priority: 4, color: 'red' }
];

// ===== CRITICAL MEDICATIONS FOR SNAPSHOT =====
const CRITICAL_MEDS = [
  { name: 'Methotrexate', dose: '15mg', schedule: 'Weekly (Monday)', warning: 'IMMUNOSUPPRESSANT', color: 'red' },
  { name: 'Albuterol', dose: 'PRN', schedule: 'Rescue Inhaler', warning: 'KEEP ACCESSIBLE', color: 'blue' },
  { name: 'Midodrine', dose: '2.5mg', schedule: '3x daily (before 4pm)', warning: 'For POTS', color: 'purple' },
  { name: 'Propranolol', dose: '20mg', schedule: '2x daily', warning: 'Do not stop abruptly', color: 'orange' },
  { name: 'Sumatriptan', dose: '50mg', schedule: 'PRN migraine', warning: 'Max 200mg/day', color: 'yellow' }
];

// ===== FREEZE/SHUTDOWN PROTOCOL =====
const FREEZE_PROTOCOL = {
  recognizeSigns: [
    'Feeling "stuck" or unable to move',
    'Dissociation or feeling detached from body',
    'Difficulty speaking or responding',
    'Numbness or heaviness',
    'Time distortion',
    'Staring blankly'
  ],
  reduceStimulation: [
    'Dim or turn off bright lights',
    'Reduce noise - turn off TV/music',
    'Move to quiet space if possible',
    'Remove tight clothing if comfortable',
    'Avoid crowded areas'
  ],
  groundingTechniques: [
    '5-4-3-2-1: Name 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste',
    'Hold something cold (ice cube, cold water)',
    'Press feet firmly into the floor',
    'Squeeze a stress ball or soft object',
    'Breathe slowly: 4 counts in, 7 hold, 8 out',
    'Name your current location and date'
  ],
  contactSupport: [
    'Text or call Quincy or Da\'Veon',
    'Use pre-written "I need help" message',
    'If alone, move to safe comfortable spot',
    'Wait for support before making decisions'
  ]
};

// ===== MAIN COMPONENT =====
const EmergencyModule: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('card');
  const [expandedProtocol, setExpandedProtocol] = useState<string | null>(null);
  const [debriefs, setDebriefs] = useState<CrisisDebrief[]>([]);
  const [showDebriefForm, setShowDebriefForm] = useState(false);
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [newDebrief, setNewDebrief] = useState<Partial<CrisisDebrief>>({
    type: 'pots',
    severity: 3
  });

  // Load debriefs from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('crisis-debriefs');
    if (stored) {
      setDebriefs(JSON.parse(stored));
    }
  }, []);

  // Save debriefs
  const saveDebriefs = (newDebriefs: CrisisDebrief[]) => {
    setDebriefs(newDebriefs);
    localStorage.setItem('crisis-debriefs', JSON.stringify(newDebriefs));
  };

  // Add debrief
  const addDebrief = () => {
    if (!newDebrief.triggers && !newDebrief.whatHelped) {
      toast.error('Please add some details');
      return;
    }
    const debrief: CrisisDebrief = {
      id: `debrief_${Date.now()}`,
      date: new Date().toISOString(),
      type: newDebrief.type || 'other',
      duration: newDebrief.duration || '',
      triggers: newDebrief.triggers || '',
      whatHelped: newDebrief.whatHelped || '',
      whatDidntHelp: newDebrief.whatDidntHelp || '',
      notes: newDebrief.notes || '',
      severity: newDebrief.severity || 3
    };
    saveDebriefs([debrief, ...debriefs]);
    setNewDebrief({ type: 'pots', severity: 3 });
    setShowDebriefForm(false);
    toast.success('Crisis debrief logged');
  };

  // Delete debrief
  const deleteDebrief = (id: string) => {
    saveDebriefs(debriefs.filter(d => d.id !== id));
    toast.success('Debrief removed');
  };

  // Handle print
  const handlePrint = () => {
    setIsPrintMode(true);
    setTimeout(() => {
      window.print();
      setIsPrintMode(false);
    }, 100);
  };

  // Phone call handler
  const handleCall = (phone: string, name: string) => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    } else {
      toast.error(`No phone number saved for ${name}`);
    }
  };

  // Calculate age
  const calculateAge = () => {
    const today = new Date();
    const birth = new Date('1999-09-07');
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className={`min-h-screen ${isPrintMode ? 'bg-white text-black' : 'bg-gradient-to-br from-purple-950 via-purple-900 to-black'}`}>
      {/* PRINT STYLES */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
            font-size: 14pt !important;
          }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .print-card {
            page-break-inside: avoid;
            border: 3px solid #dc2626 !important;
            padding: 20px !important;
            margin: 10px !important;
          }
          * {
            color: black !important;
            background: white !important;
          }
          .emergency-red {
            color: #dc2626 !important;
            font-weight: bold !important;
          }
        }
        @media screen {
          .print-only { display: none; }
        }
      `}</style>

      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4 no-print">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-600 rounded-xl">
              <AlertTriangle className="w-10 h-10 text-white" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white">
                EMERGENCY & CRISIS MODULE
              </h1>
              <p className="text-purple-300 text-lg">Critical information for emergencies</p>
            </div>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-xl transition-colors text-lg"
            aria-label="Print emergency card"
          >
            <Printer className="w-6 h-6" aria-hidden="true" />
            Print Card
          </button>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex flex-wrap gap-2 mb-6 no-print" role="tablist">
          {[
            { id: 'card', label: 'Emergency Card', icon: Heart },
            { id: 'freeze', label: 'Freeze Protocol', icon: Brain },
            { id: 'pots', label: 'POTS Protocol', icon: Activity },
            { id: 'contacts', label: 'Who to Call', icon: Phone },
            { id: 'meds', label: 'Medications', icon: Pill },
            { id: 'consent', label: 'Consent Notes', icon: Shield },
            { id: 'debrief', label: 'Crisis Log', icon: FileText }
          ].map(tab => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeSection === tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center gap-2 py-3 px-5 rounded-xl font-bold text-lg transition-all ${
                activeSection === tab.id
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/50'
                  : 'bg-purple-800/50 text-purple-200 hover:bg-purple-700/50'
              }`}
            >
              <tab.icon className="w-5 h-5" aria-hidden="true" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ===== EMERGENCY CARD SECTION ===== */}
        {(activeSection === 'card' || isPrintMode) && (
          <div className="print-card bg-gradient-to-br from-red-900/40 to-purple-900/40 border-4 border-red-500 rounded-2xl p-6 md:p-8 mb-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl md:text-4xl font-black text-red-400 emergency-red mb-2">
                MEDICAL EMERGENCY CARD
              </h2>
              <p className="text-xl text-purple-200 print:text-gray-600">
                Show this to first responders or medical staff
              </p>
            </div>

            {/* Patient Info */}
            <div className="bg-black/40 print:bg-gray-100 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-white print:text-black mb-1">
                    Sydney Lee Jones (Kol)
                  </h3>
                  <p className="text-xl text-purple-300 print:text-gray-600 font-semibold">
                    Pronouns: They/She
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl text-white print:text-black">
                    <span className="font-bold">DOB:</span> September 7, 1999
                  </p>
                  <p className="text-xl text-white print:text-black">
                    <span className="font-bold">Age:</span> {calculateAge()} years old
                  </p>
                </div>
              </div>
            </div>

            {/* Blood Type - Large and Prominent */}
            <div className="bg-red-600 rounded-xl p-6 mb-6 text-center">
              <p className="text-lg font-bold text-red-100 mb-1">BLOOD TYPE</p>
              <p className="text-5xl md:text-6xl font-black text-white">A+</p>
              <p className="text-xl text-red-100 mt-1">A Positive</p>
            </div>

            {/* Key Conditions */}
            <div className="bg-yellow-500/20 border-2 border-yellow-500 rounded-xl p-6 mb-6">
              <h3 className="text-2xl font-black text-yellow-400 emergency-red mb-4 flex items-center gap-3">
                <AlertCircle className="w-8 h-8" aria-hidden="true" />
                KEY CONDITIONS
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {EMERGENCY_INFO.conditions.map((condition, idx) => (
                  <div key={idx} className="bg-black/40 print:bg-gray-200 rounded-lg p-4">
                    <p className="text-xl font-bold text-white print:text-black">{condition}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Allergies - Critical */}
            <div className="bg-red-500/20 border-2 border-red-500 rounded-xl p-6 mb-6">
              <h3 className="text-2xl font-black text-red-400 emergency-red mb-4 flex items-center gap-3">
                <AlertTriangle className="w-8 h-8" aria-hidden="true" />
                ALLERGIES - DO NOT GIVE
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {EMERGENCY_INFO.allergies.map((allergy, idx) => (
                  <div key={idx} className="bg-red-900/40 print:bg-red-100 border-2 border-red-400 rounded-lg p-4 text-center">
                    <p className="text-2xl font-black text-red-300 print:text-red-600">{allergy}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-black/40 print:bg-gray-100 rounded-lg p-4">
                <p className="text-xl font-bold text-red-300 print:text-red-600">
                  DO NOT USE: Ketorolac (Toradol), Latex products
                </p>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-blue-500/20 border-2 border-blue-500 rounded-xl p-6 mb-6">
              <h3 className="text-2xl font-black text-blue-400 mb-4 flex items-center gap-3">
                <Phone className="w-8 h-8" aria-hidden="true" />
                EMERGENCY CONTACTS
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-black/40 print:bg-gray-200 rounded-lg p-4">
                  <div>
                    <p className="text-xl font-bold text-white print:text-black">Quincy</p>
                    <p className="text-purple-300 print:text-gray-600">Partner (Priority 1)</p>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-black/40 print:bg-gray-200 rounded-lg p-4">
                  <div>
                    <p className="text-xl font-bold text-white print:text-black">Da'Veon</p>
                    <p className="text-purple-300 print:text-gray-600">Partner (Priority 2)</p>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-black/40 print:bg-gray-200 rounded-lg p-4">
                  <div>
                    <p className="text-xl font-bold text-white print:text-black">Mary Jones</p>
                    <p className="text-purple-300 print:text-gray-600">Mother</p>
                  </div>
                  <p className="text-2xl font-black text-green-400 print:text-green-600">913-638-8640</p>
                </div>
              </div>
            </div>

            {/* Hospital Preference */}
            <div className="bg-green-500/20 border-2 border-green-500 rounded-xl p-6 mb-6">
              <h3 className="text-2xl font-black text-green-400 mb-4">HOSPITAL PREFERENCE</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black/40 print:bg-gray-200 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-white print:text-black">Saint Luke's</p>
                </div>
                <div className="bg-black/40 print:bg-gray-200 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-white print:text-black">Truman Medical Centers</p>
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            <div className="bg-purple-500/20 border-2 border-purple-500 rounded-xl p-6">
              <h3 className="text-2xl font-black text-purple-400 mb-4">IMPORTANT CARE NOTES</h3>
              <ul className="space-y-2">
                {EMERGENCY_INFO.instructions.map((instruction, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-lg text-white print:text-black">
                    <Check className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" aria-hidden="true" />
                    {instruction}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ===== FREEZE/SHUTDOWN PROTOCOL ===== */}
        {activeSection === 'freeze' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-2 border-purple-500 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <Brain className="w-12 h-12 text-purple-400" aria-hidden="true" />
                <div>
                  <h2 className="text-3xl font-black text-white">Freeze/Shutdown Protocol</h2>
                  <p className="text-purple-300 text-lg">Step-by-step guide for dissociative episodes</p>
                </div>
              </div>

              {/* Step 1: Recognize */}
              <div className="mb-6">
                <button
                  onClick={() => setExpandedProtocol(expandedProtocol === 'recognize' ? null : 'recognize')}
                  className="w-full flex items-center justify-between bg-red-600/30 hover:bg-red-600/40 border-2 border-red-500 rounded-xl p-5 transition-colors"
                  aria-expanded={expandedProtocol === 'recognize'}
                >
                  <div className="flex items-center gap-4">
                    <span className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-2xl font-black text-white">1</span>
                    <span className="text-2xl font-bold text-white">Recognize the Signs</span>
                  </div>
                  {expandedProtocol === 'recognize' ? <ChevronUp className="w-8 h-8 text-white" /> : <ChevronDown className="w-8 h-8 text-white" />}
                </button>
                {expandedProtocol === 'recognize' && (
                  <div className="bg-black/40 rounded-b-xl p-6 border-x-2 border-b-2 border-red-500/50">
                    <ul className="space-y-3">
                      {FREEZE_PROTOCOL.recognizeSigns.map((sign, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-xl text-white">
                          <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" aria-hidden="true" />
                          {sign}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Step 2: Reduce Stimulation */}
              <div className="mb-6">
                <button
                  onClick={() => setExpandedProtocol(expandedProtocol === 'reduce' ? null : 'reduce')}
                  className="w-full flex items-center justify-between bg-yellow-600/30 hover:bg-yellow-600/40 border-2 border-yellow-500 rounded-xl p-5 transition-colors"
                  aria-expanded={expandedProtocol === 'reduce'}
                >
                  <div className="flex items-center gap-4">
                    <span className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center text-2xl font-black text-white">2</span>
                    <span className="text-2xl font-bold text-white">Reduce Stimulation</span>
                  </div>
                  {expandedProtocol === 'reduce' ? <ChevronUp className="w-8 h-8 text-white" /> : <ChevronDown className="w-8 h-8 text-white" />}
                </button>
                {expandedProtocol === 'reduce' && (
                  <div className="bg-black/40 rounded-b-xl p-6 border-x-2 border-b-2 border-yellow-500/50">
                    <ul className="space-y-3">
                      {FREEZE_PROTOCOL.reduceStimulation.map((step, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-xl text-white">
                          <Check className="w-6 h-6 text-yellow-400 flex-shrink-0" aria-hidden="true" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Step 3: Grounding */}
              <div className="mb-6">
                <button
                  onClick={() => setExpandedProtocol(expandedProtocol === 'ground' ? null : 'ground')}
                  className="w-full flex items-center justify-between bg-green-600/30 hover:bg-green-600/40 border-2 border-green-500 rounded-xl p-5 transition-colors"
                  aria-expanded={expandedProtocol === 'ground'}
                >
                  <div className="flex items-center gap-4">
                    <span className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-2xl font-black text-white">3</span>
                    <span className="text-2xl font-bold text-white">Grounding Techniques</span>
                  </div>
                  {expandedProtocol === 'ground' ? <ChevronUp className="w-8 h-8 text-white" /> : <ChevronDown className="w-8 h-8 text-white" />}
                </button>
                {expandedProtocol === 'ground' && (
                  <div className="bg-black/40 rounded-b-xl p-6 border-x-2 border-b-2 border-green-500/50">
                    <ul className="space-y-4">
                      {FREEZE_PROTOCOL.groundingTechniques.map((technique, idx) => (
                        <li key={idx} className="bg-green-900/30 rounded-lg p-4">
                          <p className="text-xl text-white font-semibold">{technique}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Step 4: Contact Support */}
              <div className="mb-6">
                <button
                  onClick={() => setExpandedProtocol(expandedProtocol === 'contact' ? null : 'contact')}
                  className="w-full flex items-center justify-between bg-blue-600/30 hover:bg-blue-600/40 border-2 border-blue-500 rounded-xl p-5 transition-colors"
                  aria-expanded={expandedProtocol === 'contact'}
                >
                  <div className="flex items-center gap-4">
                    <span className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-black text-white">4</span>
                    <span className="text-2xl font-bold text-white">Contact Support Person</span>
                  </div>
                  {expandedProtocol === 'contact' ? <ChevronUp className="w-8 h-8 text-white" /> : <ChevronDown className="w-8 h-8 text-white" />}
                </button>
                {expandedProtocol === 'contact' && (
                  <div className="bg-black/40 rounded-b-xl p-6 border-x-2 border-b-2 border-blue-500/50">
                    <ul className="space-y-3">
                      {FREEZE_PROTOCOL.contactSupport.map((step, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-xl text-white">
                          <Phone className="w-6 h-6 text-blue-400 flex-shrink-0" aria-hidden="true" />
                          {step}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={() => handleCall('', 'Quincy')}
                        className="flex items-center justify-center gap-3 bg-pink-600 hover:bg-pink-500 text-white font-bold py-4 px-6 rounded-xl text-xl transition-colors"
                      >
                        <Phone className="w-6 h-6" aria-hidden="true" />
                        Call Quincy
                      </button>
                      <button
                        onClick={() => handleCall('', "Da'Veon")}
                        className="flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 px-6 rounded-xl text-xl transition-colors"
                      >
                        <Phone className="w-6 h-6" aria-hidden="true" />
                        Call Da'Veon
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== POTS EPISODE PROTOCOL ===== */}
        {activeSection === 'pots' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-red-900/40 to-purple-900/40 border-2 border-red-500 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <Activity className="w-12 h-12 text-red-400" aria-hidden="true" />
                <div>
                  <h2 className="text-3xl font-black text-white">POTS Episode Protocol</h2>
                  <p className="text-red-300 text-lg">Postural Orthostatic Tachycardia Syndrome</p>
                </div>
              </div>

              {/* Symptoms to Watch */}
              <div className="bg-yellow-500/20 border-2 border-yellow-500 rounded-xl p-6 mb-6">
                <h3 className="text-2xl font-black text-yellow-400 mb-4 flex items-center gap-3">
                  <AlertTriangle className="w-8 h-8" aria-hidden="true" />
                  SYMPTOMS TO WATCH FOR
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {POTS_EPISODE_PROTOCOL.symptoms.map((symptom, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-black/40 rounded-lg p-4">
                      <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" aria-hidden="true" />
                      <p className="text-xl text-white font-semibold">{symptom}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Immediate Care Steps */}
              <div className="bg-green-500/20 border-2 border-green-500 rounded-xl p-6 mb-6">
                <h3 className="text-2xl font-black text-green-400 mb-4 flex items-center gap-3">
                  <Check className="w-8 h-8" aria-hidden="true" />
                  IMMEDIATE CARE STEPS
                </h3>
                <ol className="space-y-3">
                  {POTS_EPISODE_PROTOCOL.immediateCareProtocol.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-4 bg-black/40 rounded-lg p-4">
                      <span className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-xl font-black text-white flex-shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-xl text-white font-semibold pt-1">{step.replace(/^\d+\.\s*/, '')}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Emergency Protocol */}
              <div className="bg-red-500/20 border-2 border-red-500 rounded-xl p-6">
                <h3 className="text-2xl font-black text-red-400 mb-4 flex items-center gap-3">
                  <AlertTriangle className="w-8 h-8" aria-hidden="true" />
                  EMERGENCY ESCALATION
                </h3>
                <p className="text-lg text-red-300 mb-4">If symptoms persist or worsen:</p>
                <ul className="space-y-3 mb-6">
                  {POTS_EPISODE_PROTOCOL.emergencyProtocol.map((step, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-xl text-white">
                      <Check className="w-6 h-6 text-red-400 flex-shrink-0" aria-hidden="true" />
                      {step}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleCall('911', '911')}
                  className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-500 text-white font-black py-5 px-6 rounded-xl text-2xl transition-colors"
                  aria-label="Call 911"
                >
                  <Phone className="w-8 h-8" aria-hidden="true" />
                  CALL 911
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== WHO TO CALL ===== */}
        {activeSection === 'contacts' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-2 border-purple-500 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <Phone className="w-12 h-12 text-purple-400" aria-hidden="true" />
                <div>
                  <h2 className="text-3xl font-black text-white">Who to Call</h2>
                  <p className="text-purple-300 text-lg">One-tap calling in priority order</p>
                </div>
              </div>

              <div className="space-y-4">
                {EMERGENCY_CONTACTS.map((contact, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCall(contact.phone, contact.name)}
                    className={`w-full flex items-center justify-between p-6 rounded-xl border-2 transition-all hover:scale-[1.02] ${
                      contact.color === 'pink' ? 'bg-pink-600/30 border-pink-500 hover:bg-pink-600/40' :
                      contact.color === 'purple' ? 'bg-purple-600/30 border-purple-500 hover:bg-purple-600/40' :
                      contact.color === 'blue' ? 'bg-blue-600/30 border-blue-500 hover:bg-blue-600/40' :
                      'bg-red-600/30 border-red-500 hover:bg-red-600/40'
                    }`}
                    aria-label={`Call ${contact.name}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl font-black text-white ${
                        contact.color === 'pink' ? 'bg-pink-600' :
                        contact.color === 'purple' ? 'bg-purple-600' :
                        contact.color === 'blue' ? 'bg-blue-600' :
                        'bg-red-600'
                      }`}>
                        {contact.priority}
                      </span>
                      <div className="text-left">
                        <p className="text-2xl font-black text-white">{contact.name}</p>
                        <p className="text-lg text-purple-300">{contact.relationship}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {contact.phone && (
                        <span className="text-xl font-bold text-green-400">{contact.phone}</span>
                      )}
                      <Phone className="w-10 h-10 text-white" aria-hidden="true" />
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 bg-purple-900/30 border border-purple-500/50 rounded-xl p-4">
                <p className="text-lg text-purple-300">
                  <strong>Note:</strong> Call contacts in order. If first contact doesn't answer, try the next.
                  Call 911 if this is a medical emergency.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ===== MEDICATIONS SNAPSHOT ===== */}
        {activeSection === 'meds' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-900/40 to-green-900/40 border-2 border-purple-500 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <Pill className="w-12 h-12 text-purple-400" aria-hidden="true" />
                <div>
                  <h2 className="text-3xl font-black text-white">Critical Medications</h2>
                  <p className="text-purple-300 text-lg">Quick reference for emergency situations</p>
                </div>
              </div>

              <div className="space-y-4">
                {CRITICAL_MEDS.map((med, idx) => (
                  <div
                    key={idx}
                    className={`rounded-xl p-5 border-2 ${
                      med.color === 'red' ? 'bg-red-500/20 border-red-500' :
                      med.color === 'blue' ? 'bg-blue-500/20 border-blue-500' :
                      med.color === 'purple' ? 'bg-purple-500/20 border-purple-500' :
                      med.color === 'orange' ? 'bg-orange-500/20 border-orange-500' :
                      'bg-yellow-500/20 border-yellow-500'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-black text-white">{med.name}</h3>
                        <p className="text-xl text-purple-300">{med.dose} - {med.schedule}</p>
                      </div>
                      <div className={`px-4 py-2 rounded-lg font-bold text-lg ${
                        med.color === 'red' ? 'bg-red-600 text-white' :
                        med.color === 'blue' ? 'bg-blue-600 text-white' :
                        med.color === 'purple' ? 'bg-purple-600 text-white' :
                        med.color === 'orange' ? 'bg-orange-600 text-white' :
                        'bg-yellow-600 text-black'
                      }`}>
                        {med.warning}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Emergency Medications */}
              <div className="mt-6 bg-red-500/20 border-2 border-red-500 rounded-xl p-6">
                <h3 className="text-2xl font-black text-red-400 mb-4">RESCUE MEDICATIONS</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {EMERGENCY_INFO.emergencyMedications.map((med, idx) => (
                    <div key={idx} className="bg-black/40 rounded-lg p-4 text-center">
                      <p className="text-xl font-bold text-white">{med}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== CONSENT NOTES ===== */}
        {activeSection === 'consent' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-2 border-purple-500 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <Shield className="w-12 h-12 text-purple-400" aria-hidden="true" />
                <div>
                  <h2 className="text-3xl font-black text-white">Consent & Care Notes</h2>
                  <p className="text-purple-300 text-lg">Trauma-informed care requirements</p>
                </div>
              </div>

              {/* Background Context */}
              <div className="bg-yellow-500/20 border-2 border-yellow-500 rounded-xl p-6 mb-6">
                <h3 className="text-2xl font-black text-yellow-400 mb-4">IMPORTANT CONTEXT</h3>
                <ul className="space-y-3">
                  {PSYCHOSOCIAL_CONSIDERATIONS.background.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xl text-white">
                      <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Absolute Care Rules */}
              <div className="bg-red-500/20 border-2 border-red-500 rounded-xl p-6 mb-6">
                <h3 className="text-2xl font-black text-red-400 mb-4">ABSOLUTE CARE RULES</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PSYCHOSOCIAL_CONSIDERATIONS.absoluteCareRules.map((rule, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-black/40 rounded-lg p-4">
                      <Check className="w-6 h-6 text-green-400 flex-shrink-0" aria-hidden="true" />
                      <p className="text-xl text-white font-semibold">{rule}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Communication Preferences */}
              <div className="bg-blue-500/20 border-2 border-blue-500 rounded-xl p-6">
                <h3 className="text-2xl font-black text-blue-400 mb-4">COMMUNICATION PREFERENCES</h3>
                <ul className="space-y-3">
                  {PSYCHOSOCIAL_CONSIDERATIONS.communicationPreferences.map((pref, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-xl text-white">
                      <MessageSquare className="w-6 h-6 text-blue-400 flex-shrink-0" aria-hidden="true" />
                      {pref}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ===== CRISIS DEBRIEF LOG ===== */}
        {activeSection === 'debrief' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-900/40 to-green-900/40 border-2 border-purple-500 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <FileText className="w-12 h-12 text-purple-400" aria-hidden="true" />
                  <div>
                    <h2 className="text-3xl font-black text-white">Crisis Debrief Log</h2>
                    <p className="text-purple-300 text-lg">Track and learn from episodes</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDebriefForm(!showDebriefForm)}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-xl transition-colors text-lg"
                >
                  <Plus className="w-6 h-6" aria-hidden="true" />
                  {showDebriefForm ? 'Cancel' : 'Log Episode'}
                </button>
              </div>

              {/* Debrief Form */}
              {showDebriefForm && (
                <div className="bg-black/40 rounded-xl p-6 mb-6 border border-purple-500/50">
                  <h3 className="text-xl font-bold text-purple-300 mb-4">New Crisis Debrief</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-purple-300 font-semibold mb-2 text-lg">Episode Type</label>
                        <select
                          value={newDebrief.type}
                          onChange={(e) => setNewDebrief({...newDebrief, type: e.target.value as CrisisDebrief['type']})}
                          className="w-full bg-black/60 border-2 border-purple-500/50 rounded-xl px-4 py-3 text-white text-lg"
                        >
                          <option value="pots">POTS Episode</option>
                          <option value="freeze">Freeze/Shutdown</option>
                          <option value="asthma">Asthma Attack</option>
                          <option value="other">Other Crisis</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-purple-300 font-semibold mb-2 text-lg">Duration</label>
                        <input
                          type="text"
                          placeholder="e.g., 20 minutes"
                          value={newDebrief.duration || ''}
                          onChange={(e) => setNewDebrief({...newDebrief, duration: e.target.value})}
                          className="w-full bg-black/60 border-2 border-purple-500/50 rounded-xl px-4 py-3 text-white text-lg placeholder-purple-400/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-purple-300 font-semibold mb-2 text-lg">Severity (1-5)</label>
                      <div className="flex gap-3">
                        {[1, 2, 3, 4, 5].map(level => (
                          <button
                            key={level}
                            onClick={() => setNewDebrief({...newDebrief, severity: level as CrisisDebrief['severity']})}
                            className={`w-14 h-14 rounded-xl font-bold text-xl transition-all ${
                              newDebrief.severity === level
                                ? level <= 2 ? 'bg-green-600 text-white' : level <= 3 ? 'bg-yellow-600 text-white' : 'bg-red-600 text-white'
                                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-purple-300 font-semibold mb-2 text-lg">Triggers</label>
                      <textarea
                        placeholder="What may have triggered this episode?"
                        value={newDebrief.triggers || ''}
                        onChange={(e) => setNewDebrief({...newDebrief, triggers: e.target.value})}
                        className="w-full bg-black/60 border-2 border-purple-500/50 rounded-xl px-4 py-3 text-white text-lg placeholder-purple-400/50"
                        rows={2}
                      />
                    </div>

                    <div>
                      <label className="block text-purple-300 font-semibold mb-2 text-lg">What Helped</label>
                      <textarea
                        placeholder="What techniques or interventions were helpful?"
                        value={newDebrief.whatHelped || ''}
                        onChange={(e) => setNewDebrief({...newDebrief, whatHelped: e.target.value})}
                        className="w-full bg-black/60 border-2 border-purple-500/50 rounded-xl px-4 py-3 text-white text-lg placeholder-purple-400/50"
                        rows={2}
                      />
                    </div>

                    <div>
                      <label className="block text-purple-300 font-semibold mb-2 text-lg">What Didn't Help</label>
                      <textarea
                        placeholder="What didn't work or made things worse?"
                        value={newDebrief.whatDidntHelp || ''}
                        onChange={(e) => setNewDebrief({...newDebrief, whatDidntHelp: e.target.value})}
                        className="w-full bg-black/60 border-2 border-purple-500/50 rounded-xl px-4 py-3 text-white text-lg placeholder-purple-400/50"
                        rows={2}
                      />
                    </div>

                    <div>
                      <label className="block text-purple-300 font-semibold mb-2 text-lg">Additional Notes</label>
                      <textarea
                        placeholder="Any other observations..."
                        value={newDebrief.notes || ''}
                        onChange={(e) => setNewDebrief({...newDebrief, notes: e.target.value})}
                        className="w-full bg-black/60 border-2 border-purple-500/50 rounded-xl px-4 py-3 text-white text-lg placeholder-purple-400/50"
                        rows={2}
                      />
                    </div>

                    <button
                      onClick={addDebrief}
                      className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl text-xl transition-colors"
                    >
                      Save Debrief
                    </button>
                  </div>
                </div>
              )}

              {/* Debrief History */}
              {debriefs.length > 0 ? (
                <div className="space-y-4">
                  {debriefs.map((debrief) => (
                    <div key={debrief.id} className="bg-black/40 rounded-xl p-5 border border-purple-500/30">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <span className={`px-4 py-2 rounded-lg font-bold text-lg ${
                            debrief.type === 'pots' ? 'bg-red-600/30 text-red-300 border border-red-500' :
                            debrief.type === 'freeze' ? 'bg-purple-600/30 text-purple-300 border border-purple-500' :
                            debrief.type === 'asthma' ? 'bg-blue-600/30 text-blue-300 border border-blue-500' :
                            'bg-gray-600/30 text-gray-300 border border-gray-500'
                          }`}>
                            {debrief.type === 'pots' ? 'POTS Episode' :
                             debrief.type === 'freeze' ? 'Freeze/Shutdown' :
                             debrief.type === 'asthma' ? 'Asthma Attack' : 'Other'}
                          </span>
                          <span className={`px-3 py-1 rounded-lg font-bold ${
                            debrief.severity <= 2 ? 'bg-green-600/30 text-green-300' :
                            debrief.severity <= 3 ? 'bg-yellow-600/30 text-yellow-300' :
                            'bg-red-600/30 text-red-300'
                          }`}>
                            Severity: {debrief.severity}/5
                          </span>
                        </div>
                        <button
                          onClick={() => deleteDebrief(debrief.id)}
                          className="p-2 hover:bg-red-500/30 rounded-lg transition-colors"
                          aria-label="Delete debrief"
                        >
                          <Trash2 className="w-5 h-5 text-red-400" aria-hidden="true" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-purple-300 mb-4">
                        <Calendar className="w-5 h-5" aria-hidden="true" />
                        <span className="text-lg">{new Date(debrief.date).toLocaleDateString()} at {new Date(debrief.date).toLocaleTimeString()}</span>
                        {debrief.duration && <span className="text-purple-400">| Duration: {debrief.duration}</span>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {debrief.triggers && (
                          <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/30">
                            <p className="text-yellow-400 font-bold mb-2">Triggers:</p>
                            <p className="text-white">{debrief.triggers}</p>
                          </div>
                        )}
                        {debrief.whatHelped && (
                          <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30">
                            <p className="text-green-400 font-bold mb-2">What Helped:</p>
                            <p className="text-white">{debrief.whatHelped}</p>
                          </div>
                        )}
                        {debrief.whatDidntHelp && (
                          <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
                            <p className="text-red-400 font-bold mb-2">What Didn't Help:</p>
                            <p className="text-white">{debrief.whatDidntHelp}</p>
                          </div>
                        )}
                        {debrief.notes && (
                          <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
                            <p className="text-purple-400 font-bold mb-2">Notes:</p>
                            <p className="text-white">{debrief.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto text-purple-400/50 mb-4" aria-hidden="true" />
                  <p className="text-xl text-purple-300">No crisis debriefs logged yet</p>
                  <p className="text-purple-400 mt-2">Logging episodes helps identify patterns and effective interventions</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PRINT-ONLY COMPACT CARD */}
        <div className="print-only mt-8">
          <div className="print-card border-4 border-red-600 p-6">
            <h2 className="text-3xl font-black text-center mb-4 emergency-red">MEDICAL EMERGENCY CARD</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="font-bold text-xl">Sydney Lee Jones (Kol)</p>
                <p>Pronouns: They/She</p>
                <p>DOB: September 7, 1999</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-2xl emergency-red">Blood Type: A+</p>
              </div>
            </div>
            <div className="border-2 border-red-600 p-3 mb-4">
              <p className="font-bold emergency-red">CONDITIONS: EDS, POTS, Asthma, On MTX (immunosuppressant), C-PTSD, AuDHD</p>
            </div>
            <div className="border-2 border-red-600 p-3 mb-4">
              <p className="font-bold emergency-red">ALLERGIES: Ketorolac, Latex, Oranges</p>
            </div>
            <div className="mb-4">
              <p className="font-bold">Emergency Contacts:</p>
              <p>1. Quincy (Partner) | 2. Da'Veon (Partner) | 3. Mary Jones (Mother): 913-638-8640</p>
            </div>
            <div>
              <p className="font-bold">Preferred Hospitals: Saint Luke's or Truman Medical Centers</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 bg-purple-900/20 border border-purple-500/30 rounded-xl p-4 no-print">
          <p className="text-purple-300 text-center">
            <strong>Emergency Module</strong> - Keep this information accessible. Print the emergency card to carry with you.
            Update information regularly to ensure accuracy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyModule;
