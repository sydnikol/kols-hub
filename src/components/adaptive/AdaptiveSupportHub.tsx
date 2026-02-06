import React, { useState, useEffect } from 'react';

// Types from adaptive-support-hub
interface WearableData {
  userId: string;
  source: 'fitbit' | 'apple-watch' | 'pixel-watch' | 'other';
  type: 'heart-rate' | 'steps' | 'sleep' | 'activity' | 'stress';
  value: number;
  unit: string;
  timestamp: Date;
}

interface BodyWeatherEntry {
  id: string;
  pain_level: number;
  energy_level: number;
  mood: number;
  spoons_available: number;
  symptoms: string[];
  triggers?: string[];
  notes?: string;
  logged_at: Date;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time_of_day: string[];
  active: boolean;
  reminders_enabled: boolean;
}

interface VitalsLog {
  heart_rate?: number;
  bp_systolic?: number;
  bp_diastolic?: number;
  oxygen?: number;
  temperature?: number;
  logged_at: Date;
}

interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

// Main Component
const AdaptiveSupportHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'health' | 'body-weather' | 'wardrobe' | 'daily-life' | 'emergency'>('dashboard');
  const [bodyWeather, setBodyWeather] = useState<BodyWeatherEntry | null>(null);
  const [wearableData, setWearableData] = useState<WearableData[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [vitals, setVitals] = useState<VitalsLog | null>(null);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Load mock data
  useEffect(() => {
    // Simulate loading data
    setMedications([
      { id: '1', name: 'Medication A', dosage: '10mg', frequency: 'Daily', time_of_day: ['morning'], active: true, reminders_enabled: true },
      { id: '2', name: 'Medication B', dosage: '5mg', frequency: 'Twice Daily', time_of_day: ['morning', 'evening'], active: true, reminders_enabled: true },
    ]);

    setWearableData([
      { userId: '1', source: 'pixel-watch', type: 'heart-rate', value: 72, unit: 'bpm', timestamp: new Date() },
      { userId: '1', source: 'pixel-watch', type: 'steps', value: 5432, unit: 'steps', timestamp: new Date() },
    ]);

    setVitals({
      heart_rate: 72,
      bp_systolic: 118,
      bp_diastolic: 76,
      oxygen: 98,
      temperature: 98.6,
      logged_at: new Date()
    });
  }, []);

  const logBodyWeather = (entry: Partial<BodyWeatherEntry>) => {
    const newEntry: BodyWeatherEntry = {
      id: `bw-${Date.now()}`,
      pain_level: entry.pain_level || 0,
      energy_level: entry.energy_level || 5,
      mood: entry.mood || 5,
      spoons_available: entry.spoons_available || 10,
      symptoms: entry.symptoms || [],
      triggers: entry.triggers,
      notes: entry.notes,
      logged_at: new Date()
    };
    setBodyWeather(newEntry);
    localStorage.setItem('lastBodyWeather', JSON.stringify(newEntry));
  };

  const getAIInsight = async () => {
    setIsLoading(true);
    // Simulate AI response
    setTimeout(() => {
      setAiResponse(`Based on your recent data:
• Your heart rate is stable at ${vitals?.heart_rate} bpm
• You've walked ${wearableData.find(d => d.type === 'steps')?.value || 0} steps today
• ${bodyWeather ? `Pain level: ${bodyWeather.pain_level}/10` : 'Remember to log your body weather'}

Suggestion: Consider a gentle stretch break if you've been sitting for a while.`);
      setIsLoading(false);
    }, 1000);
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'health', label: 'Health', icon: '❤️' },
    { id: 'body-weather', label: 'Body Weather', icon: '🌤️' },
    { id: 'wardrobe', label: 'Wardrobe', icon: '👗' },
    { id: 'daily-life', label: 'Daily Life', icon: '📅' },
    { id: 'emergency', label: 'Emergency', icon: '🚨' },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-4">
          <span className="text-5xl">🌟</span>
          <div>
            <h1 className="text-3xl font-bold text-white">Adaptive Support Hub</h1>
            <p className="text-purple-300">Your personal wellness companion</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon="❤️" label="Heart Rate" value={`${vitals?.heart_rate || '--'} bpm`} color="red" />
              <StatCard icon="👣" label="Steps Today" value={`${wearableData.find(d => d.type === 'steps')?.value || 0}`} color="green" />
              <StatCard icon="🩸" label="Blood Pressure" value={`${vitals?.bp_systolic || '--'}/${vitals?.bp_diastolic || '--'}`} color="blue" />
              <StatCard icon="💊" label="Medications" value={`${medications.length} active`} color="purple" />
            </div>

            {/* AI Companion */}
            <div className="p-6 bg-gradient-to-br from-gray-900 to-purple-900/30 rounded-xl border border-purple-500/30">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>🤖</span> AI Companion
              </h2>
              <button
                onClick={getAIInsight}
                disabled={isLoading}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg mb-4"
              >
                {isLoading ? '🔄 Analyzing...' : '✨ Get Personalized Insight'}
              </button>
              {aiResponse && (
                <div className="p-4 bg-black/30 rounded-lg text-gray-200 whitespace-pre-wrap">
                  {aiResponse}
                </div>
              )}
            </div>

            {/* Wearable Data */}
            <div className="p-6 bg-gradient-to-br from-gray-900 to-indigo-900/30 rounded-xl border border-indigo-500/30">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>⌚</span> Wearable Data
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {wearableData.map((data, i) => (
                  <div key={i} className="p-4 bg-black/30 rounded-lg">
                    <div className="text-gray-400 text-sm capitalize">{data.type.replace('-', ' ')}</div>
                    <div className="text-2xl font-bold text-white">{data.value} {data.unit}</div>
                    <div className="text-xs text-gray-500">{data.source}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Health Tab */}
        {activeTab === 'health' && (
          <div className="space-y-6">
            {/* Vitals */}
            <div className="p-6 bg-gradient-to-br from-gray-900 to-red-900/20 rounded-xl border border-red-500/30">
              <h2 className="text-xl font-bold text-white mb-4">Current Vitals</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <VitalCard label="Heart Rate" value={vitals?.heart_rate} unit="bpm" icon="❤️" />
                <VitalCard label="BP Systolic" value={vitals?.bp_systolic} unit="mmHg" icon="🔺" />
                <VitalCard label="BP Diastolic" value={vitals?.bp_diastolic} unit="mmHg" icon="🔻" />
                <VitalCard label="Oxygen" value={vitals?.oxygen} unit="%" icon="💨" />
                <VitalCard label="Temperature" value={vitals?.temperature} unit="°F" icon="🌡️" />
              </div>
            </div>

            {/* Medications */}
            <div className="p-6 bg-gradient-to-br from-gray-900 to-blue-900/20 rounded-xl border border-blue-500/30">
              <h2 className="text-xl font-bold text-white mb-4">Medications</h2>
              <div className="space-y-3">
                {medications.map(med => (
                  <div key={med.id} className="p-4 bg-black/30 rounded-lg flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">{med.name}</h3>
                      <p className="text-gray-400 text-sm">{med.dosage} • {med.frequency}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {med.time_of_day.map(time => (
                        <span key={time} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                          {time}
                        </span>
                      ))}
                      <button className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-sm rounded">
                        ✓ Taken
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Body Weather Tab */}
        {activeTab === 'body-weather' && (
          <BodyWeatherTracker onLog={logBodyWeather} currentEntry={bodyWeather} />
        )}

        {/* Wardrobe Tab */}
        {activeTab === 'wardrobe' && (
          <WardrobeComfortSection />
        )}

        {/* Daily Life Tab */}
        {activeTab === 'daily-life' && (
          <DailyLifeSection />
        )}

        {/* Emergency Tab */}
        {activeTab === 'emergency' && (
          <EmergencySection />
        )}
      </div>
    </div>
  );
};

// Sub-components
const StatCard: React.FC<{ icon: string; label: string; value: string; color: string }> = ({ icon, label, value, color }) => (
  <div className={`p-4 bg-gradient-to-br from-gray-900 to-${color}-900/20 rounded-xl border border-${color}-500/30`}>
    <div className="text-2xl mb-2">{icon}</div>
    <div className="text-gray-400 text-sm">{label}</div>
    <div className="text-xl font-bold text-white">{value}</div>
  </div>
);

const VitalCard: React.FC<{ label: string; value?: number; unit: string; icon: string }> = ({ label, value, unit, icon }) => (
  <div className="p-4 bg-black/30 rounded-lg text-center">
    <div className="text-2xl mb-1">{icon}</div>
    <div className="text-2xl font-bold text-white">{value ?? '--'}</div>
    <div className="text-xs text-gray-400">{unit}</div>
    <div className="text-xs text-gray-500 mt-1">{label}</div>
  </div>
);

const BodyWeatherTracker: React.FC<{ onLog: (entry: Partial<BodyWeatherEntry>) => void; currentEntry: BodyWeatherEntry | null }> = ({ onLog, currentEntry }) => {
  const [pain, setPain] = useState(currentEntry?.pain_level || 5);
  const [energy, setEnergy] = useState(currentEntry?.energy_level || 5);
  const [mood, setMood] = useState(currentEntry?.mood || 5);
  const [spoons, setSpoons] = useState(currentEntry?.spoons_available || 10);
  const [symptoms, setSymptoms] = useState<string[]>(currentEntry?.symptoms || []);
  const [notes, setNotes] = useState(currentEntry?.notes || '');

  const symptomOptions = ['Fatigue', 'Pain', 'Brain Fog', 'Anxiety', 'Nausea', 'Dizziness', 'Headache', 'Muscle Tension', 'Joint Pain', 'Sensory Overload'];

  const handleSubmit = () => {
    onLog({ pain_level: pain, energy_level: energy, mood, spoons_available: spoons, symptoms, notes });
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900 to-amber-900/20 rounded-xl border border-amber-500/30">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <span>🌤️</span> Body Weather Check-In
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sliders */}
        <div className="space-y-6">
          <SliderInput label="Pain Level" value={pain} onChange={setPain} emoji={pain > 7 ? '😣' : pain > 4 ? '😐' : '😊'} />
          <SliderInput label="Energy Level" value={energy} onChange={setEnergy} emoji={energy > 7 ? '⚡' : energy > 4 ? '🔋' : '🪫'} />
          <SliderInput label="Mood" value={mood} onChange={setMood} emoji={mood > 7 ? '😄' : mood > 4 ? '😐' : '😔'} />
          <SliderInput label="Spoons Available" value={spoons} max={15} onChange={setSpoons} emoji="🥄" />
        </div>

        {/* Symptoms */}
        <div>
          <label className="block text-gray-300 mb-2">Current Symptoms</label>
          <div className="flex flex-wrap gap-2 mb-4">
            {symptomOptions.map(symptom => (
              <button
                key={symptom}
                onClick={() => {
                  if (symptoms.includes(symptom)) {
                    setSymptoms(symptoms.filter(s => s !== symptom));
                  } else {
                    setSymptoms([...symptoms, symptom]);
                  }
                }}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  symptoms.includes(symptom)
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {symptom}
              </button>
            ))}
          </div>

          <label className="block text-gray-300 mb-2">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional notes about how you're feeling..."
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400"
            rows={4}
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition-colors"
      >
        📝 Log Body Weather
      </button>
    </div>
  );
};

const SliderInput: React.FC<{ label: string; value: number; onChange: (v: number) => void; emoji: string; max?: number }> = ({ label, value, onChange, emoji, max = 10 }) => (
  <div>
    <div className="flex justify-between mb-1">
      <label className="text-gray-300">{label}</label>
      <span className="text-white font-bold">{emoji} {value}/{max}</span>
    </div>
    <input
      type="range"
      min="0"
      max={max}
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full accent-amber-500"
    />
  </div>
);

const WardrobeComfortSection: React.FC = () => {
  const [energyLevel, setEnergyLevel] = useState(5);
  const [painLevel, setPainLevel] = useState(3);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const getSuggestion = () => {
    if (painLevel > 6) {
      setSuggestion('🛋️ Flare Day Outfit: Loose cotton pants, soft oversized tee, compression socks optional. Focus on zero-pressure clothing.');
    } else if (energyLevel < 4) {
      setSuggestion('😴 Low Spoon Outfit: Pull-on leggings, soft hoodie, slip-on shoes. Minimal buttons or zippers.');
    } else {
      setSuggestion('✨ Regular Day: Your favorite comfortable jeans, a sensory-friendly top, and your go-to sneakers.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-gradient-to-br from-gray-900 to-pink-900/20 rounded-xl border border-pink-500/30">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>👗</span> Wardrobe Comfort Advisor
        </h2>
        <p className="text-gray-400 mb-4">Get outfit suggestions based on your current comfort needs.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <SliderInput label="Current Energy" value={energyLevel} onChange={setEnergyLevel} emoji="⚡" />
          <SliderInput label="Current Pain" value={painLevel} onChange={setPainLevel} emoji={painLevel > 6 ? '😣' : '😊'} />
        </div>

        <button
          onClick={getSuggestion}
          className="w-full py-3 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-lg transition-colors"
        >
          👗 Get Outfit Suggestion
        </button>

        {suggestion && (
          <div className="mt-4 p-4 bg-black/30 rounded-lg text-white">
            {suggestion}
          </div>
        )}
      </div>

      <div className="p-6 bg-gradient-to-br from-gray-900 to-purple-900/20 rounded-xl border border-purple-500/30">
        <h3 className="text-lg font-bold text-white mb-4">Comfort Profiles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ProfileCard name="Flare Day" emoji="🛋️" description="Maximum comfort, zero pressure" />
          <ProfileCard name="Low Spoon" emoji="🥄" description="Easy on/off, minimal effort" />
          <ProfileCard name="Sensory Safe" emoji="🌿" description="Soft fabrics, no tags" />
        </div>
      </div>
    </div>
  );
};

const ProfileCard: React.FC<{ name: string; emoji: string; description: string }> = ({ name, emoji, description }) => (
  <div className="p-4 bg-black/30 rounded-lg text-center">
    <div className="text-3xl mb-2">{emoji}</div>
    <h4 className="text-white font-bold">{name}</h4>
    <p className="text-gray-400 text-sm">{description}</p>
  </div>
);

const DailyLifeSection: React.FC = () => (
  <div className="space-y-6">
    <div className="p-6 bg-gradient-to-br from-gray-900 to-green-900/20 rounded-xl border border-green-500/30">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span>📅</span> Daily Rituals
      </h2>
      <div className="space-y-3">
        <RitualItem name="Morning Routine" time="7:00 AM" completed={true} />
        <RitualItem name="Medication Check" time="8:00 AM" completed={true} />
        <RitualItem name="Hydration Reminder" time="10:00 AM" completed={false} />
        <RitualItem name="Stretch Break" time="12:00 PM" completed={false} />
        <RitualItem name="Evening Wind Down" time="9:00 PM" completed={false} />
      </div>
    </div>

    <div className="p-6 bg-gradient-to-br from-gray-900 to-blue-900/20 rounded-xl border border-blue-500/30">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span>💧</span> Hydration Tracker
      </h2>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all" style={{ width: '60%' }} />
          </div>
        </div>
        <span className="text-white font-bold">6/10 glasses</span>
      </div>
      <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg">
        💧 Log Water
      </button>
    </div>
  </div>
);

const RitualItem: React.FC<{ name: string; time: string; completed: boolean }> = ({ name, time, completed }) => (
  <div className={`p-3 rounded-lg flex items-center justify-between ${completed ? 'bg-green-900/30' : 'bg-gray-800'}`}>
    <div className="flex items-center gap-3">
      <span className={`text-xl ${completed ? 'opacity-50' : ''}`}>{completed ? '✅' : '⏰'}</span>
      <div>
        <h4 className={`text-white ${completed ? 'line-through opacity-50' : ''}`}>{name}</h4>
        <p className="text-gray-400 text-sm">{time}</p>
      </div>
    </div>
    {!completed && (
      <button className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-sm rounded">
        Complete
      </button>
    )}
  </div>
);

const EmergencySection: React.FC = () => {
  const [showCard, setShowCard] = useState(false);

  const emergencyContacts: EmergencyContact[] = [
    { name: 'Primary Contact', phone: '(555) 123-4567', relationship: 'Partner', isPrimary: true },
    { name: 'Doctor', phone: '(555) 987-6543', relationship: 'PCP', isPrimary: false },
  ];

  return (
    <div className="space-y-6">
      <div className="p-6 bg-gradient-to-br from-gray-900 to-red-900/30 rounded-xl border border-red-500/30">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>🚨</span> Emergency Profile
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-black/30 rounded-lg">
            <h3 className="text-white font-bold mb-2">Key Conditions</h3>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Ehlers-Danlos Syndrome (hEDS)</li>
              <li>• ADHD</li>
              <li>• Anxiety Disorder</li>
            </ul>
          </div>
          <div className="p-4 bg-black/30 rounded-lg">
            <h3 className="text-white font-bold mb-2">If Freeze/Dissociation Occurs</h3>
            <ol className="text-gray-300 text-sm space-y-1">
              <li>1. Speak calmly and slowly</li>
              <li>2. Offer grounding object</li>
              <li>3. Don't touch without permission</li>
              <li>4. Wait patiently</li>
            </ol>
          </div>
        </div>

        <button
          onClick={() => setShowCard(!showCard)}
          className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-colors"
        >
          📋 {showCard ? 'Hide' : 'Show'} Emergency Card
        </button>

        {showCard && (
          <div className="mt-4 p-4 bg-white text-black rounded-lg">
            <h3 className="font-bold text-center text-lg mb-2">🚨 EMERGENCY INFORMATION</h3>
            <div className="text-sm space-y-2">
              <p><strong>Conditions:</strong> hEDS, ADHD, Anxiety</p>
              <p><strong>Medications:</strong> See current list</p>
              <p><strong>Allergies:</strong> None known</p>
              <p><strong>Emergency Contact:</strong> {emergencyContacts[0].name} - {emergencyContacts[0].phone}</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-gradient-to-br from-gray-900 to-orange-900/20 rounded-xl border border-orange-500/30">
        <h2 className="text-xl font-bold text-white mb-4">Emergency Contacts</h2>
        <div className="space-y-3">
          {emergencyContacts.map((contact, i) => (
            <div key={i} className="p-4 bg-black/30 rounded-lg flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">{contact.name}</h4>
                <p className="text-gray-400 text-sm">{contact.relationship}</p>
              </div>
              <a
                href={`tel:${contact.phone}`}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg flex items-center gap-2"
              >
                📞 {contact.phone}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdaptiveSupportHub;
