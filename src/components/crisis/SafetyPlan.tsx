import React, { useState, useEffect } from 'react';
import { Shield, Phone, Heart, AlertCircle, User, Home, Check, Download, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface SafetyPlanData {
  warningSignsPersonal: string[];
  warningSignsExternal: string[];
  copingStrategies: string[];
  socialDistractions: string[];
  professionalContacts: Contact[];
  supportContacts: Contact[];
  safeEnvironment: string[];
  reasonsToLive: string[];
  emergencyNumbers: EmergencyNumber[];
  lastUpdated: number;
}

interface Contact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  available: string;
  notes?: string;
}

interface EmergencyNumber {
  id: string;
  name: string;
  number: string;
  description: string;
  available: string;
}

const defaultEmergencyNumbers: EmergencyNumber[] = [
  {
    id: 'crisis_1',
    name: '988 Suicide & Crisis Lifeline',
    number: '988',
    description: '24/7 suicide prevention and crisis support',
    available: '24/7',
  },
  {
    id: 'crisis_2',
    name: 'Crisis Text Line',
    number: 'Text HOME to 741741',
    description: 'Text-based crisis support',
    available: '24/7',
  },
  {
    id: 'crisis_3',
    name: 'Emergency Services',
    number: '911',
    description: 'Immediate emergency response',
    available: '24/7',
  },
  {
    id: 'crisis_4',
    name: 'SAMHSA National Helpline',
    number: '1-800-662-4357',
    description: 'Mental health and substance use treatment referral',
    available: '24/7',
  },
  {
    id: 'crisis_5',
    name: 'Veterans Crisis Line',
    number: '1-800-273-8255 (Press 1)',
    description: 'Support for veterans in crisis',
    available: '24/7',
  },
  {
    id: 'crisis_6',
    name: 'Trans Lifeline',
    number: '1-877-565-8860',
    description: 'Peer support for transgender people',
    available: '10am-4am EST',
  },
  {
    id: 'crisis_7',
    name: 'Trevor Project (LGBTQ+ Youth)',
    number: '1-866-488-7386',
    description: 'Crisis support for LGBTQ+ young people',
    available: '24/7',
  },
];

const SafetyPlan: React.FC = () => {
  const [plan, setPlan] = useState<SafetyPlanData>({
    warningSignsPersonal: [],
    warningSignsExternal: [],
    copingStrategies: [],
    socialDistractions: [],
    professionalContacts: [],
    supportContacts: [],
    safeEnvironment: [],
    reasonsToLive: [],
    emergencyNumbers: defaultEmergencyNumbers,
    lastUpdated: Date.now(),
  });

  const [editSection, setEditSection] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = () => {
    const saved = localStorage.getItem('safety_plan');
    if (saved) {
      const parsed = JSON.parse(saved);
      setPlan({
        ...parsed,
        emergencyNumbers: defaultEmergencyNumbers, // Always use updated emergency numbers
      });
    }
  };

  const savePlan = (data: SafetyPlanData) => {
    const updated = { ...data, lastUpdated: Date.now() };
    setPlan(updated);
    localStorage.setItem('safety_plan', JSON.stringify(updated));
    toast.success('Safety plan saved');
  };

  const addToList = (field: keyof SafetyPlanData, value: string) => {
    if (!value.trim()) return;
    const list = plan[field] as string[];
    savePlan({ ...plan, [field]: [...list, value.trim()] });
    setInputValue('');
  };

  const removeFromList = (field: keyof SafetyPlanData, index: number) => {
    const list = plan[field] as string[];
    savePlan({ ...plan, [field]: list.filter((_, i) => i !== index) });
  };

  const addContact = (type: 'professionalContacts' | 'supportContacts', contact: Omit<Contact, 'id'>) => {
    if (!contact.name || !contact.phone) {
      toast.error('Name and phone are required');
      return;
    }

    const newContact: Contact = {
      ...contact,
      id: `contact_${Date.now()}`,
    };

    savePlan({ ...plan, [type]: [...plan[type], newContact] });
    setEditSection(null);
  };

  const removeContact = (type: 'professionalContacts' | 'supportContacts', id: string) => {
    savePlan({ ...plan, [type]: plan[type].filter(c => c.id !== id) });
  };

  const exportPlan = () => {
    let content = `SAFETY PLAN\n`;
    content += `Last Updated: ${new Date(plan.lastUpdated).toLocaleString()}\n`;
    content += `\n${'='.repeat(80)}\n\n`;

    content += `STEP 1: WARNING SIGNS\n\n`;
    if (plan.warningSignsPersonal.length > 0) {
      content += `Personal Warning Signs:\n`;
      plan.warningSignsPersonal.forEach(sign => content += `  • ${sign}\n`);
    }
    if (plan.warningSignsExternal.length > 0) {
      content += `\nExternal Warning Signs:\n`;
      plan.warningSignsExternal.forEach(sign => content += `  • ${sign}\n`);
    }

    content += `\n${'='.repeat(80)}\n\n`;
    content += `STEP 2: COPING STRATEGIES (Use Without Contacting Others)\n\n`;
    plan.copingStrategies.forEach(strategy => content += `  • ${strategy}\n`);

    content += `\n${'='.repeat(80)}\n\n`;
    content += `STEP 3: SOCIAL SETTINGS FOR DISTRACTION\n\n`;
    plan.socialDistractions.forEach(place => content += `  • ${place}\n`);

    content += `\n${'='.repeat(80)}\n\n`;
    content += `STEP 4: PEOPLE I CAN ASK FOR HELP\n\n`;
    plan.supportContacts.forEach(contact => {
      content += `${contact.name} (${contact.relationship})\n`;
      content += `  Phone: ${contact.phone}\n`;
      content += `  Available: ${contact.available}\n`;
      if (contact.notes) content += `  Notes: ${contact.notes}\n`;
      content += `\n`;
    });

    content += `\n${'='.repeat(80)}\n\n`;
    content += `STEP 5: PROFESSIONAL CONTACTS\n\n`;
    plan.professionalContacts.forEach(contact => {
      content += `${contact.name} (${contact.relationship})\n`;
      content += `  Phone: ${contact.phone}\n`;
      content += `  Available: ${contact.available}\n`;
      if (contact.notes) content += `  Notes: ${contact.notes}\n`;
      content += `\n`;
    });

    content += `\n${'='.repeat(80)}\n\n`;
    content += `STEP 6: MAKING ENVIRONMENT SAFE\n\n`;
    plan.safeEnvironment.forEach(step => content += `  • ${step}\n`);

    content += `\n${'='.repeat(80)}\n\n`;
    content += `STEP 7: REASONS FOR LIVING\n\n`;
    plan.reasonsToLive.forEach(reason => content += `  • ${reason}\n`);

    content += `\n${'='.repeat(80)}\n\n`;
    content += `EMERGENCY CRISIS LINES (24/7 Support)\n\n`;
    plan.emergencyNumbers.forEach(line => {
      content += `${line.name}\n`;
      content += `  ${line.number}\n`;
      content += `  ${line.description}\n`;
      content += `  Available: ${line.available}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `safety-plan-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    toast.success('Safety plan exported');
  };

  const callNumber = (number: string) => {
    window.location.href = `tel:${number.replace(/[^0-9]/g, '')}`;
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-red-400" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
            Safety Plan
          </h1>
        </div>
        <p className="text-purple-300 mb-4">
          A personalized plan to help you stay safe during a crisis
        </p>
        <div className="flex gap-3">
          <button
            onClick={exportPlan}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg border border-blue-500/50 transition-all"
          >
            <Download className="w-5 h-5" />
            Export Plan
          </button>
          <span className="text-sm text-purple-400">
            Last updated: {new Date(plan.lastUpdated).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Emergency Crisis Lines - Always Visible */}
      <div className="bg-gradient-to-br from-red-900/30 to-pink-900/30 p-6 rounded-xl border border-red-500/50 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Phone className="w-6 h-6 text-red-400" />
          <h2 className="text-2xl font-bold text-white">🚨 Emergency Crisis Lines</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plan.emergencyNumbers.map(line => (
            <div key={line.id} className="bg-red-900/20 p-4 rounded-lg border border-red-500/30">
              <h3 className="text-white font-bold mb-1">{line.name}</h3>
              <button
                onClick={() => callNumber(line.number)}
                className="text-2xl font-bold text-red-300 hover:text-red-200 mb-2 block"
              >
                {line.number}
              </button>
              <p className="text-red-200 text-sm mb-1">{line.description}</p>
              <p className="text-red-400 text-xs">Available: {line.available}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {/* Step 1: Warning Signs */}
        <div className="bg-purple-900/20 p-6 rounded-xl border border-purple-500/30">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Step 1: Warning Signs</h2>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-purple-300 mb-2">Personal Warning Signs</h3>
            <p className="text-purple-400 text-sm mb-3">Thoughts, images, moods, or behaviors that indicate a crisis may be developing</p>
            <div className="space-y-2 mb-3">
              {plan.warningSignsPersonal.map((sign, i) => (
                <div key={i} className="flex items-center justify-between bg-purple-900/30 p-3 rounded-lg">
                  <span className="text-purple-200">{sign}</span>
                  <button
                    onClick={() => removeFromList('warningSignsPersonal', i)}
                    className="p-1 hover:bg-red-500/20 rounded transition-all"
                  >
                    <X className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={editSection === 'warningSignsPersonal' ? inputValue : ''}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => setEditSection('warningSignsPersonal')}
                onKeyPress={(e) => e.key === 'Enter' && addToList('warningSignsPersonal', inputValue)}
                placeholder="e.g., Feeling hopeless, isolating myself..."
                className="flex-1 px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200 placeholder-purple-500"
              />
              <button
                onClick={() => addToList('warningSignsPersonal', inputValue)}
                className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-all"
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-purple-300 mb-2">External Warning Signs</h3>
            <p className="text-purple-400 text-sm mb-3">Situations, events, or people that may trigger a crisis</p>
            <div className="space-y-2 mb-3">
              {plan.warningSignsExternal.map((sign, i) => (
                <div key={i} className="flex items-center justify-between bg-purple-900/30 p-3 rounded-lg">
                  <span className="text-purple-200">{sign}</span>
                  <button
                    onClick={() => removeFromList('warningSignsExternal', i)}
                    className="p-1 hover:bg-red-500/20 rounded transition-all"
                  >
                    <X className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={editSection === 'warningSignsExternal' ? inputValue : ''}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => setEditSection('warningSignsExternal')}
                onKeyPress={(e) => e.key === 'Enter' && addToList('warningSignsExternal', inputValue)}
                placeholder="e.g., Conflict with family, anniversary of loss..."
                className="flex-1 px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200 placeholder-purple-500"
              />
              <button
                onClick={() => addToList('warningSignsExternal', inputValue)}
                className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-all"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Step 2: Coping Strategies */}
        <div className="bg-green-900/20 p-6 rounded-xl border border-green-500/30">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-6 h-6 text-green-400" />
            <h2 className="text-2xl font-bold text-white">Step 2: Internal Coping Strategies</h2>
          </div>
          <p className="text-green-400 text-sm mb-3">Things I can do on my own without contacting another person</p>
          <div className="space-y-2 mb-3">
            {plan.copingStrategies.map((strategy, i) => (
              <div key={i} className="flex items-center justify-between bg-green-900/30 p-3 rounded-lg">
                <span className="text-green-200">{strategy}</span>
                <button
                  onClick={() => removeFromList('copingStrategies', i)}
                  className="p-1 hover:bg-red-500/20 rounded transition-all"
                >
                  <X className="w-4 h-4 text-red-400" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={editSection === 'copingStrategies' ? inputValue : ''}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setEditSection('copingStrategies')}
              onKeyPress={(e) => e.key === 'Enter' && addToList('copingStrategies', inputValue)}
              placeholder="e.g., Listen to music, take a walk, use breathing exercises..."
              className="flex-1 px-4 py-2 bg-green-900/30 border border-green-500/30 rounded-lg text-green-200 placeholder-green-500"
            />
            <button
              onClick={() => addToList('copingStrategies', inputValue)}
              className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-all"
            >
              Add
            </button>
          </div>
        </div>

        {/* Step 7: Reasons to Live */}
        <div className="bg-pink-900/20 p-6 rounded-xl border border-pink-500/30">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-6 h-6 text-pink-400" />
            <h2 className="text-2xl font-bold text-white">Reasons for Living</h2>
          </div>
          <p className="text-pink-400 text-sm mb-3">The things that are important to me and worth living for</p>
          <div className="space-y-2 mb-3">
            {plan.reasonsToLive.map((reason, i) => (
              <div key={i} className="flex items-center justify-between bg-pink-900/30 p-3 rounded-lg">
                <span className="text-pink-200">{reason}</span>
                <button
                  onClick={() => removeFromList('reasonsToLive', i)}
                  className="p-1 hover:bg-red-500/20 rounded transition-all"
                >
                  <X className="w-4 h-4 text-red-400" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={editSection === 'reasonsToLive' ? inputValue : ''}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setEditSection('reasonsToLive')}
              onKeyPress={(e) => e.key === 'Enter' && addToList('reasonsToLive', inputValue)}
              placeholder="e.g., My pets, my future, my friends, my art..."
              className="flex-1 px-4 py-2 bg-pink-900/30 border border-pink-500/30 rounded-lg text-pink-200 placeholder-pink-500"
            />
            <button
              onClick={() => addToList('reasonsToLive', inputValue)}
              className="px-4 py-2 bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 rounded-lg transition-all"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-purple-900/20 p-6 rounded-xl border border-purple-500/30 mt-6">
        <h3 className="text-lg font-bold text-purple-300 mb-2">About Safety Planning</h3>
        <p className="text-purple-400 leading-relaxed">
          A safety plan is a personalized, practical plan to help you navigate through a crisis. It's most effective
          when created during a time of stability and reviewed regularly. This plan is based on the Stanley-Brown
          Safety Planning Intervention, an evidence-based crisis intervention. <strong className="text-red-400">If you're in immediate danger, call 911 or go to your nearest emergency room.</strong>
        </p>
      </div>
    </div>
  );
};

export default SafetyPlan;
