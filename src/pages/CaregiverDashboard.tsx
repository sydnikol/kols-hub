import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Heart, Pill, Activity, AlertTriangle, Phone,
  Clock, Calendar, FileText, Shield, Bell, CheckCircle,
  Droplet, Thermometer, TrendingUp, MessageCircle, Share2,
  User, Home, Utensils, Info, AlertCircle, Battery,
  Map, Wifi, Smartphone
} from 'lucide-react';
import toast from 'react-hot-toast';
import { db } from '../utils/database';

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  priority: number;
  canMedicateMe: boolean;
}

interface CareProtocol {
  id: string;
  situation: string;
  steps: string[];
  whoToCall: string[];
  medications?: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
}

export default function CaregiverDashboard() {
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [currentStatus, setCurrentStatus] = useState<'good' | 'ok' | 'concerning' | 'emergency'>('good');
  const [medications, setMedications] = useState<any[]>([]);
  const [vitals, setVitals] = useState<any[]>([]);
  const [lastActive, setLastActive] = useState(new Date());
  const [shareCode, setShareCode] = useState('');

  useEffect(() => {
    loadAllData();
    initializeDefaultProtocols();
    generateShareCode();
    updateActivityStatus();
  }, []);

  const loadAllData = async () => {
    try {
      const [meds, vit] = await Promise.all([
        db.medications.toArray(),
        db.vitals.orderBy('timestamp').reverse().limit(5).toArray()
      ]);
      setMedications(meds);
      setVitals(vit);

      // Load emergency contacts from localStorage
      const contacts = JSON.parse(localStorage.getItem('emergencyContacts') || '[]');
      setEmergencyContacts(contacts);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const updateActivityStatus = () => {
    const active = localStorage.getItem('lastActive');
    if (active) {
      setLastActive(new Date(active));
    }
    // Update every minute
    const interval = setInterval(() => {
      const active = localStorage.getItem('lastActive');
      if (active) {
        setLastActive(new Date(active));
      }
    }, 60000);
    return () => clearInterval(interval);
  };

  const generateShareCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setShareCode(code);
  };

  const initializeDefaultProtocols = () => {
    const defaultProtocols: CareProtocol[] = [
      {
        id: '1',
        situation: 'POTS Flare / Syncope Episode',
        urgencyLevel: 'high',
        whoToCall: ['Primary Emergency Contact', 'Doctor if conscious', '911 if unconscious'],
        steps: [
          '1. Have them lie down immediately with legs elevated',
          '2. Check if they\'re conscious and responsive',
          '3. Give water with electrolytes if conscious',
          '4. Take vital signs (HR, BP if possible)',
          '5. Stay with them, keep them calm',
          '6. If unconscious >30 seconds, call 911',
          '7. Note: Do NOT try to make them sit/stand up'
        ],
        medications: ['Give prescribed salt tablets if conscious', 'Midodrine if scheduled']
      },
      {
        id: '2',
        situation: 'Low Blood Pressure Episode',
        urgencyLevel: 'medium',
        whoToCall: ['Primary Contact', 'Check with patient before calling doctor'],
        steps: [
          '1. Have them lie down with feet elevated 12 inches',
          '2. Give them water with electrolytes',
          '3. Check blood pressure every 15 minutes',
          '4. Compression socks if available',
          '5. Cool room temperature',
          '6. Do not let them stand quickly'
        ],
        medications: ['Salt tablets', 'Fluids', 'Follow medication schedule']
      },
      {
        id: '3',
        situation: 'Medication Schedule - Daily',
        urgencyLevel: 'low',
        whoToCall: [],
        steps: [
          'Morning: Check medication list and times',
          'Ensure medications are taken with food if required',
          'Track in medication log',
          'Check for any missed doses',
          'Refill water bottle for hydration'
        ]
      },
      {
        id: '4',
        situation: 'High Heart Rate (>120 resting)',
        urgencyLevel: 'medium',
        whoToCall: ['Monitor first', 'Contact doctor if sustained >30 min'],
        steps: [
          '1. Have them lie down in cool environment',
          '2. Remove tight clothing',
          '3. Give cold water to drink',
          '4. Monitor heart rate every 5 minutes',
          '5. If not improving after 30 min, call doctor',
          '6. If >150 sustained, consider ER'
        ]
      },
      {
        id: '5',
        situation: 'Unconscious / Unresponsive',
        urgencyLevel: 'emergency',
        whoToCall: ['CALL 911 IMMEDIATELY'],
        steps: [
          '1. CALL 911 FIRST',
          '2. Check breathing and pulse',
          '3. Position: Lie flat, elevate legs if breathing',
          '4. If not breathing: Start CPR',
          '5. Have medication list ready for paramedics',
          '6. Unlock phone (code in emergency contacts)',
          '7. Have medical info ready (allergies, conditions)'
        ]
      },
      {
        id: '6',
        situation: 'Severe Dehydration',
        urgencyLevel: 'medium',
        whoToCall: ['Primary Contact', 'Doctor if not improving'],
        steps: [
          '1. Give water with electrolytes immediately',
          '2. Small frequent sips, not large amounts',
          '3. Track fluid intake',
          '4. Cool environment',
          '5. Monitor urine output',
          '6. If no improvement in 2 hours, call doctor'
        ]
      }
    ];

    localStorage.setItem('careProtocols', JSON.stringify(defaultProtocols));
  };

  const protocols: CareProtocol[] = JSON.parse(localStorage.getItem('careProtocols') || '[]');

  const addEmergencyContact = () => {
    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      name: '',
      relationship: '',
      phone: '',
      priority: emergencyContacts.length + 1,
      canMedicateMe: false
    };
    const updated = [...emergencyContacts, newContact];
    setEmergencyContacts(updated);
    localStorage.setItem('emergencyContacts', JSON.stringify(updated));
  };

  const medicalInfo = {
    conditions: ['POTS (Postural Orthostatic Tachycardia Syndrome)', 'Add other conditions...'],
    allergies: ['List any allergies...'],
    bloodType: 'Type here...',
    emergencyNotes: 'Important info for first responders...'
  };

  const getStatusColor = () => {
    switch (currentStatus) {
      case 'good': return 'from-green-600 to-emerald-600';
      case 'ok': return 'from-yellow-600 to-amber-600';
      case 'concerning': return 'from-orange-600 to-red-600';
      case 'emergency': return 'from-red-600 to-rose-600';
    }
  };

  const getActivityStatus = () => {
    const now = new Date();
    const diff = now.getTime() - lastActive.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 15) return { status: 'Active now', color: 'text-green-400' };
    if (minutes < 60) return { status: `${minutes}m ago`, color: 'text-yellow-400' };
    if (minutes < 240) return { status: `${Math.floor(minutes/60)}h ago`, color: 'text-orange-400' };
    return { status: 'Inactive >4h', color: 'text-red-400' };
  };

  const activityStatus = getActivityStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-900 to-zinc-950 pl-20 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-12 h-12 text-blue-400" />
            <div>
              <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Caregiver Dashboard
              </h1>
              <p className="text-blue-300 text-lg">
                Help me stay safe and healthy
              </p>
            </div>
          </div>
        </motion.div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Current Status */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-gradient-to-br ${getStatusColor()} rounded-xl p-6 border border-white/10`}
          >
            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-6 h-6 text-white" />
              <h3 className="text-xl font-bold text-white">Current Status</h3>
            </div>
            <div className="text-3xl font-bold text-white capitalize mb-2">{currentStatus}</div>
            <p className="text-white/80 text-sm">Last updated: {new Date().toLocaleTimeString()}</p>
          </motion.div>

          {/* Activity Status */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-xl p-6 border border-indigo-700/30"
          >
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-6 h-6 text-indigo-400" />
              <h3 className="text-xl font-bold text-white">Activity</h3>
            </div>
            <div className={`text-3xl font-bold ${activityStatus.color}`}>
              {activityStatus.status}
            </div>
            <p className="text-gray-400 text-sm">App last active</p>
          </motion.div>

          {/* Quick Share */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 rounded-xl p-6 border border-cyan-700/30"
          >
            <div className="flex items-center gap-3 mb-2">
              <Share2 className="w-6 h-6 text-cyan-400" />
              <h3 className="text-xl font-bold text-white">Share Code</h3>
            </div>
            <div className="text-3xl font-bold text-cyan-400 font-mono">{shareCode}</div>
            <p className="text-gray-400 text-sm">Give this to caregivers</p>
          </motion.div>
        </div>

        {/* Emergency Protocols */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-red-900/20 to-orange-900/20 rounded-xl p-6 border border-red-700/30 mb-6"
        >
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            Emergency Protocols - Quick Reference
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {protocols.map((protocol) => (
              <div
                key={protocol.id}
                className={`bg-black/30 rounded-lg p-4 border ${
                  protocol.urgencyLevel === 'emergency'
                    ? 'border-red-500'
                    : protocol.urgencyLevel === 'high'
                    ? 'border-orange-500'
                    : 'border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white">{protocol.situation}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    protocol.urgencyLevel === 'emergency' ? 'bg-red-600 text-white' :
                    protocol.urgencyLevel === 'high' ? 'bg-orange-600 text-white' :
                    protocol.urgencyLevel === 'medium' ? 'bg-yellow-600 text-white' :
                    'bg-blue-600 text-white'
                  }`}>
                    {protocol.urgencyLevel.toUpperCase()}
                  </span>
                </div>

                {protocol.whoToCall.length > 0 && (
                  <div className="mb-3">
                    <div className="text-sm font-medium text-red-400 mb-1">Who to Call:</div>
                    {protocol.whoToCall.map((person, i) => (
                      <div key={i} className="text-sm text-red-300">• {person}</div>
                    ))}
                  </div>
                )}

                <div className="space-y-1">
                  {protocol.steps.map((step, i) => (
                    <div key={i} className="text-sm text-gray-300">{step}</div>
                  ))}
                </div>

                {protocol.medications && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <div className="text-sm font-medium text-purple-400">Medications:</div>
                    {protocol.medications.map((med, i) => (
                      <div key={i} className="text-sm text-purple-300">• {med}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Current Medications & Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl p-6 border border-purple-700/30"
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Pill className="w-6 h-6 text-purple-400" />
              Current Medications
            </h2>

            <div className="space-y-3">
              {medications.length === 0 ? (
                <p className="text-gray-400">No medications tracked yet</p>
              ) : (
                medications.map((med) => (
                  <div key={med.id} className="bg-black/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white">{med.name}</h3>
                      <span className="px-2 py-1 bg-purple-600 text-white rounded text-xs">
                        {med.dosage}
                      </span>
                    </div>
                    <div className="text-sm text-gray-300">
                      <div>Frequency: {med.frequency}</div>
                      <div>Time: {med.time || 'As needed'}</div>
                      {med.notes && <div className="text-yellow-300 mt-1">⚠️ {med.notes}</div>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Recent Vitals */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 rounded-xl p-6 border border-cyan-700/30"
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-6 h-6 text-cyan-400" />
              Recent Vital Signs
            </h2>

            <div className="space-y-3">
              {vitals.length === 0 ? (
                <p className="text-gray-400">No vitals recorded yet</p>
              ) : (
                vitals.map((vital) => (
                  <div key={vital.id} className="bg-black/30 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-gray-400">Heart Rate</div>
                        <div className="text-xl font-bold text-red-400">{vital.heartRate} bpm</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Blood Pressure</div>
                        <div className="text-xl font-bold text-blue-400">
                          {vital.bloodPressureSystolic}/{vital.bloodPressureDiastolic}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400">O₂ Saturation</div>
                        <div className="text-xl font-bold text-cyan-400">{vital.oxygenSaturation}%</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Recorded</div>
                        <div className="text-sm text-gray-300">
                          {new Date(vital.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Emergency Contacts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-orange-900/40 to-red-900/40 rounded-xl p-6 border border-orange-700/30 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Phone className="w-6 h-6 text-orange-400" />
              Emergency Contacts
            </h2>
            <button
              onClick={addEmergencyContact}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700"
            >
              Add Contact
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/30 rounded-lg p-4 border-2 border-red-500">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-5 h-5 text-red-400" />
                <h3 className="text-lg font-bold text-white">PRIMARY CONTACT</h3>
              </div>
              <div className="space-y-1 text-sm">
                <div><span className="text-gray-400">Name:</span> <span className="text-white font-medium">[Add name]</span></div>
                <div><span className="text-gray-400">Phone:</span> <span className="text-white font-medium">[Add phone]</span></div>
                <div><span className="text-gray-400">Can administer meds:</span> <span className="text-green-400">Yes</span></div>
              </div>
            </div>

            {emergencyContacts.map((contact) => (
              <div key={contact.id} className="bg-black/30 rounded-lg p-4">
                <h3 className="text-lg font-bold text-white mb-2">{contact.name || '[Name]'}</h3>
                <div className="space-y-1 text-sm">
                  <div><span className="text-gray-400">Relationship:</span> {contact.relationship || '[Add]'}</div>
                  <div><span className="text-gray-400">Phone:</span> {contact.phone || '[Add]'}</div>
                  <div><span className="text-gray-400">Can administer meds:</span>
                    <span className={contact.canMedicateMe ? 'text-green-400' : 'text-gray-400'}>
                      {contact.canMedicateMe ? ' Yes' : ' No'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Medical Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-xl p-6 border border-indigo-700/30"
        >
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-400" />
            Medical Information for Emergency Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Medical Conditions</h3>
              <ul className="space-y-1">
                {medicalInfo.conditions.map((condition, i) => (
                  <li key={i} className="text-gray-300">• {condition}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Allergies</h3>
              <ul className="space-y-1">
                {medicalInfo.allergies.map((allergy, i) => (
                  <li key={i} className="text-red-300">• {allergy}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Blood Type</h3>
              <p className="text-2xl font-bold text-red-400">{medicalInfo.bloodType}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Emergency Notes</h3>
              <p className="text-gray-300">{medicalInfo.emergencyNotes}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
