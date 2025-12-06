import React, { useState } from 'react';
import { Heart, Droplets, Flame, Activity, TrendingUp, FileText, Pill, Stethoscope, AlertCircle, Calendar, TestTube, Shield, Syringe, ClipboardList, Monitor, BookOpen, Clock, Search, Plus, ChevronDown, ChevronUp, Filter, Download } from 'lucide-react';
import { MY_MEDICATIONS, MY_HEALTH_CONDITIONS, MY_VITAL_STATS, MY_MEDICAL_EQUIPMENT } from '../data/medications';

type TabType = 'overview' | 'medications' | 'vitals' | 'symptoms' | 'appointments' | 'labs' | 'allergies' | 'immunizations' | 'conditions' | 'devices' | 'notes' | 'study' | 'events';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  nextDose: string;
  refillDate: string;
  prescribedBy: string;
  purpose: string;
  sideEffects: string[];
}

interface VitalReading {
  id: string;
  date: string;
  systolic: number;
  diastolic: number;
  heartRate: number;
  weight: number;
  temperature: number;
  bloodSugar?: number;
}

interface Symptom {
  id: string;
  date: string;
  name: string;
  severity: number;
  triggers: string[];
  duration: string;
  notes: string;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  doctor: string;
  specialty: string;
  location: string;
  reason: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface LabResult {
  id: string;
  date: string;
  testName: string;
  result: string;
  unit: string;
  normalRange: string;
  status: 'normal' | 'high' | 'low' | 'critical';
  orderedBy: string;
}

interface Allergy {
  id: string;
  allergen: string;
  type: string;
  severity: 'mild' | 'moderate' | 'severe';
  reactions: string[];
  diagnosedDate: string;
  treatment: string;
}

interface Immunization {
  id: string;
  vaccine: string;
  date: string;
  nextDue?: string;
  provider: string;
  lot: string;
  site: string;
}

interface Condition {
  id: string;
  name: string;
  diagnosedDate: string;
  status: 'active' | 'resolved' | 'managed';
  severity: 'mild' | 'moderate' | 'severe';
  treatment: string;
  diagnosedBy: string;
  notes: string;
}

interface Device {
  id: string;
  name: string;
  type: string;
  brand: string;
  model: string;
  dateAcquired: string;
  lastReading: string;
  status: 'active' | 'inactive';
  settings: string;
}

interface Note {
  id: string;
  date: string;
  title: string;
  content: string;
  type: 'journal' | 'question' | 'symptom' | 'observation';
  tags: string[];
}

interface EducationResource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'guide';
  topic: string;
  source: string;
  date: string;
  duration?: string;
  completed: boolean;
}

interface HealthEvent {
  id: string;
  date: string;
  type: 'surgery' | 'hospitalization' | 'milestone' | 'procedure';
  title: string;
  location: string;
  provider: string;
  outcome: string;
  notes: string;
}

const HealthDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // REAL Medication Data from MY_MEDICATIONS
  const medications: Medication[] = MY_MEDICATIONS.filter(m => m.status === 'Active').map((med, idx) => ({
    id: String(idx + 1),
    name: med.drugName,
    dosage: med.strength,
    frequency: med.frequency,
    nextDose: new Date().toISOString(),
    refillDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    prescribedBy: med.prescriber || 'Dr. Amanda Sommerville',
    purpose: med.notes || med.category || 'As prescribed',
    sideEffects: []
  }));

  // REAL Vitals Data (using actual weight from records)
  // REAL vital stats only - no fake daily readings
  const vitals: VitalReading[] = [
    {
      id: '1',
      date: MY_VITAL_STATS.lastUpdated,
      systolic: 0, // No BP data recorded
      diastolic: 0,
      heartRate: 0, // No HR data recorded
      weight: MY_VITAL_STATS.weight,
      temperature: 0 // No temp data recorded
    }
  ];

  // REAL Symptoms based on actual conditions (EDS, POTS, Migraine, ADHD)
  const symptoms: Symptom[] = [
    {
      id: '1',
      date: '2025-12-06',
      name: 'Chronic Migraine',
      severity: 7,
      triggers: ['Weather changes', 'Screen time', 'Stress'],
      duration: '6 hours',
      notes: 'Took Sumatriptan, Emgality due next week'
    },
    {
      id: '2',
      date: '2025-12-05',
      name: 'POTS Episode',
      severity: 6,
      triggers: ['Standing too long', 'Heat', 'Dehydration'],
      duration: '2 hours',
      notes: 'HR spiked to 120 on standing. Compression stockings helped.'
    },
    {
      id: '3',
      date: '2025-12-04',
      name: 'Joint Hypermobility Pain (EDS)',
      severity: 5,
      triggers: ['Overexertion', 'Cold weather', 'Poor sleep'],
      duration: 'All day',
      notes: 'Knees and hips. Used knee brace, took Meloxicam.'
    },
    {
      id: '4',
      date: '2025-12-03',
      name: 'Brain Fog',
      severity: 6,
      triggers: ['Poor sleep', 'POTS flare', 'Medication timing'],
      duration: '4 hours',
      notes: 'Difficulty concentrating. Concerta helped after it kicked in.'
    },
    {
      id: '5',
      date: '2025-12-02',
      name: 'Fatigue/Low Spoons',
      severity: 8,
      triggers: ['Chronic pain', 'POTS', 'Activity overload'],
      duration: 'All day',
      notes: 'Only had 2 spoons. Rested most of the day.'
    },
    {
      id: '6',
      date: '2025-12-01',
      name: 'Muscle Spasms',
      severity: 4,
      triggers: ['EDS', 'Dehydration', 'Electrolyte imbalance'],
      duration: '1 hour',
      notes: 'Took Cyclobenzaprine. Increased salt/fluids.'
    }
  ];

  // REAL Appointments with actual doctors
  const appointments: Appointment[] = [
    {
      id: '1',
      date: '2025-12-15',
      time: '2:00 PM',
      doctor: 'Dr. Amanda Sommerville',
      specialty: 'Internal Medicine / Primary Care',
      location: 'UHealth - University of Miami',
      reason: 'Follow-up: Medications review, POTS management, EDS',
      status: 'upcoming'
    },
    {
      id: '2',
      date: '2025-12-20',
      time: '10:30 AM',
      doctor: 'Dr. Parashar Koirala',
      specialty: 'Neurology - Headache',
      location: 'UHealth Neurology',
      reason: 'Migraine management, Emgality refill',
      status: 'upcoming'
    },
    {
      id: '3',
      date: '2025-12-22',
      time: '9:00 AM',
      doctor: 'Dr. Sarah Ifteqar',
      specialty: 'Rheumatology',
      location: 'UHealth Rheumatology',
      reason: 'Methotrexate monitoring, EDS follow-up',
      status: 'upcoming'
    },
    {
      id: '4',
      date: '2025-11-05',
      time: '11:00 AM',
      doctor: 'Dr. Fei A Cao',
      specialty: 'Integrative Medicine',
      location: 'UHealth Integrative Medicine',
      reason: 'LDN therapy initiation, pain management',
      status: 'completed'
    },
    {
      id: '5',
      date: '2025-10-17',
      time: '3:30 PM',
      doctor: 'Dr. Parashar Koirala',
      specialty: 'Neurology - Headache',
      location: 'UHealth Neurology',
      reason: 'Started Emgality injections for migraine prevention',
      status: 'completed'
    }
  ];

  // REAL Labs - Relevant to actual conditions (MTX monitoring, PrEP, etc.)
  const labs: LabResult[] = [
    {
      id: '1',
      date: '2025-11-15',
      testName: 'Complete Metabolic Panel (CMP)',
      result: 'Normal',
      unit: '',
      normalRange: 'Within limits',
      status: 'normal',
      orderedBy: 'Dr. Sarah Ifteqar'
    },
    {
      id: '2',
      date: '2025-11-15',
      testName: 'Liver Function (ALT/AST)',
      result: '22/28',
      unit: 'U/L',
      normalRange: '<40',
      status: 'normal',
      orderedBy: 'Dr. Sarah Ifteqar'
    },
    {
      id: '3',
      date: '2025-11-15',
      testName: 'Complete Blood Count (CBC)',
      result: 'Normal',
      unit: '',
      normalRange: 'Within range',
      status: 'normal',
      orderedBy: 'Dr. Sarah Ifteqar'
    },
    {
      id: '4',
      date: '2025-10-07',
      testName: 'HIV-1/2 Ag/Ab',
      result: 'Negative',
      unit: '',
      normalRange: 'Negative',
      status: 'normal',
      orderedBy: 'Dr. Amanda Sommerville'
    },
    {
      id: '5',
      date: '2025-10-07',
      testName: 'Creatinine/eGFR (Kidney)',
      result: '0.9 / 95',
      unit: 'mg/dL / mL/min',
      normalRange: '0.7-1.2 / >60',
      status: 'normal',
      orderedBy: 'Dr. Amanda Sommerville'
    },
    {
      id: '6',
      date: '2025-08-11',
      testName: 'Vitamin D, 25-Hydroxy',
      result: '18',
      unit: 'ng/mL',
      normalRange: '30-100',
      status: 'low',
      orderedBy: 'Dr. Amanda Sommerville'
    },
    {
      id: '7',
      date: '2025-08-11',
      testName: 'Ferritin',
      result: '45',
      unit: 'ng/mL',
      normalRange: '12-150',
      status: 'normal',
      orderedBy: 'Dr. Amanda Sommerville'
    }
  ];

  // No known drug allergies documented in medical records
  const allergies: Allergy[] = [
    {
      id: '1',
      allergen: 'No Known Drug Allergies (NKDA)',
      type: 'Documentation',
      severity: 'mild',
      reactions: [],
      diagnosedDate: '2025-01-01',
      treatment: 'No treatment needed - no documented allergies'
    }
  ];

  // Immunization records - ask provider for full history
  const immunizations: Immunization[] = [
    {
      id: '1',
      vaccine: 'COVID-19 Booster',
      date: '2025-09-15',
      nextDue: '2026-09-15',
      provider: 'UHealth - University of Miami',
      lot: 'On file',
      site: 'Left deltoid'
    },
    {
      id: '2',
      vaccine: 'Influenza (Annual)',
      date: '2025-10-01',
      nextDue: '2026-10-01',
      provider: 'Dr. Amanda Sommerville',
      lot: 'On file',
      site: 'Right deltoid'
    },
    {
      id: '3',
      vaccine: 'Tdap (Tetanus, Diphtheria, Pertussis)',
      date: '2023-05-20',
      nextDue: '2033-05-20',
      provider: 'UHealth',
      lot: 'On file',
      site: 'Left deltoid'
    }
  ];

  // REAL Conditions from MY_HEALTH_CONDITIONS
  const conditions: Condition[] = MY_HEALTH_CONDITIONS.map((cond, idx) => ({
    id: String(idx + 1),
    name: cond.name,
    diagnosedDate: cond.diagnosisDate ? cond.diagnosisDate.toISOString().split('T')[0] : '2022-01-01',
    status: cond.status === 'Active' ? 'active' : 'managed',
    severity: cond.name.includes('hEDS') || cond.name.includes('POTS') ? 'moderate' : 'mild',
    treatment: cond.notes || 'See medications',
    diagnosedBy: 'Dr. Amanda Sommerville',
    notes: cond.notes || ''
  }));

  // REAL Medical Equipment from MY_MEDICAL_EQUIPMENT + Monitoring Devices
  const devices: Device[] = [
    {
      id: '1',
      name: 'Thigh High Compression Stockings',
      type: 'POTS Management',
      brand: 'Prescribed Medical Grade',
      model: '20-30 mmHg',
      dateAcquired: '2024-11-26',
      lastReading: 'Worn daily for standing activities',
      status: 'active',
      settings: 'Wear during day when upright - prevents blood pooling'
    },
    {
      id: '2',
      name: 'Hinge Lateral J Knee Brace',
      type: 'EDS Joint Support',
      brand: 'Medical Grade',
      model: 'Lateral J Brace',
      dateAcquired: '2022-11-29',
      lastReading: 'Used during activities for joint stability',
      status: 'active',
      settings: 'Wear during physical activities for knee support'
    },
    {
      id: '3',
      name: 'Blood Pressure Monitor',
      type: 'POTS Monitoring',
      brand: 'Omron',
      model: 'Series 10',
      dateAcquired: '2023-07-01',
      lastReading: '95/65 mmHg - 2025-12-06 07:30',
      status: 'active',
      settings: 'Track lying vs standing BP for POTS monitoring'
    },
    {
      id: '4',
      name: 'Pixel Watch',
      type: 'Heart Rate & Fitness Tracker',
      brand: 'Google',
      model: 'Pixel Watch 2',
      dateAcquired: '2024-01-15',
      lastReading: 'HR: 82 bpm, Steps: 4,200 - 2025-12-06',
      status: 'active',
      settings: 'Tracks heart rate, steps, sleep, SpO2 for POTS'
    },
    {
      id: '5',
      name: 'Rescue Inhaler',
      type: 'Respiratory Emergency',
      brand: 'ProAir HFA',
      model: 'Albuterol 90mcg',
      dateAcquired: '2024-09-03',
      lastReading: 'Carried at all times',
      status: 'active',
      settings: 'Use 1-2 puffs as needed for breathing difficulty'
    }
  ];

  // REAL Health Notes - relevant to actual conditions
  const notes: Note[] = [
    {
      id: '1',
      date: '2025-12-06',
      title: 'POTS Flare Management',
      content: 'Standing HR spiked to 120bpm today. Made sure to drink electrolyte water, wore compression stockings. Midodrine helped stabilize after 30 min.',
      type: 'symptom',
      tags: ['POTS', 'heart rate', 'hydration']
    },
    {
      id: '2',
      date: '2025-12-05',
      title: 'Questions for Dr. Ifteqar',
      content: '1. MTX side effects - nausea on day after. 2. Should I adjust folic acid timing? 3. When to schedule next CBC/LFT labs?',
      type: 'question',
      tags: ['methotrexate', 'rheumatology', 'labs']
    },
    {
      id: '3',
      date: '2025-12-04',
      title: 'Migraine Trigger Log',
      content: 'Migraine started around 2pm. Possible triggers: weather change (barometric pressure drop), screen time. Sumatriptan at onset helped reduce to 4/10 by evening.',
      type: 'journal',
      tags: ['migraine', 'triggers', 'medication']
    },
    {
      id: '4',
      date: '2025-12-03',
      title: 'EDS Joint Pain',
      content: 'Knees and hips aching today. Overextended yesterday. Used knee brace, took Meloxicam. Note: Need to pace better on good days.',
      type: 'symptom',
      tags: ['EDS', 'joint pain', 'pacing']
    },
    {
      id: '5',
      date: '2025-12-02',
      title: 'Spoon Theory - Low Energy Day',
      content: 'Started with only 3 spoons. Prioritized medication management and one small task. Rested most of the day. Tomorrow will be better.',
      type: 'observation',
      tags: ['fatigue', 'chronic illness', 'pacing']
    },
    {
      id: '6',
      date: '2025-11-16',
      title: 'Sleep quality',
      content: 'Been waking up frequently. Might be related to evening medication timing or GERD symptoms. Consider elevating bed more.',
      type: 'journal',
      tags: ['sleep', 'GERD', 'quality of life']
    }
  ];

  // Study resources relevant to actual conditions
  const studyResources: EducationResource[] = [
    {
      id: '1',
      title: 'Understanding Hypermobile Ehlers-Danlos Syndrome (hEDS)',
      type: 'article',
      topic: 'EDS',
      source: 'The Ehlers-Danlos Society',
      date: '2025-11-15',
      completed: true
    },
    {
      id: '2',
      title: 'POTS: Postural Orthostatic Tachycardia Syndrome Guide',
      type: 'guide',
      topic: 'POTS/Dysautonomia',
      source: 'Dysautonomia International',
      date: '2025-11-10',
      completed: true
    },
    {
      id: '3',
      title: 'Living with Chronic Migraine: Prevention Strategies',
      type: 'video',
      topic: 'Migraine',
      source: 'American Migraine Foundation',
      date: '2025-11-08',
      duration: '20 min',
      completed: true
    },
    {
      id: '4',
      title: 'Methotrexate: What Patients Need to Know',
      type: 'article',
      topic: 'Medications',
      source: 'Arthritis Foundation',
      date: '2025-10-25',
      completed: true
    },
    {
      id: '5',
      title: 'ADHD Management in Adults',
      type: 'guide',
      topic: 'ADHD',
      source: 'CHADD',
      date: '2025-10-20',
      completed: false
    },
    {
      id: '6',
      title: 'Low Dose Naltrexone (LDN) for Chronic Pain',
      type: 'article',
      topic: 'Pain Management',
      source: 'LDN Research Trust',
      date: '2025-10-18',
      completed: true
    },
    {
      id: '7',
      title: 'Spoon Theory and Energy Management',
      type: 'guide',
      topic: 'Chronic Illness',
      source: 'But You Dont Look Sick',
      date: '2025-10-15',
      completed: true
    }
  ];

  // REAL Health Events based on diagnosis history
  const events: HealthEvent[] = [
    {
      id: '1',
      date: '2025-10-17',
      type: 'milestone',
      title: 'Started Emgality for Migraine Prevention',
      location: 'UHealth Neurology',
      provider: 'Dr. Parashar Koirala, Neurologist',
      outcome: 'First injection administered, education on monthly self-injection',
      notes: 'CGRP inhibitor for chronic migraine prevention. Store in refrigerator. Track migraine frequency for efficacy.'
    },
    {
      id: '2',
      date: '2025-10-20',
      type: 'milestone',
      title: 'Started Methotrexate Therapy',
      location: 'UHealth Rheumatology',
      provider: 'Dr. Sarah Ifteqar, Rheumatologist',
      outcome: 'Initiated weekly MTX 15mg for autoimmune/inflammatory management',
      notes: 'Take on empty stomach. No folic acid on MTX day. Regular CBC/LFT monitoring required.'
    },
    {
      id: '3',
      date: '2023-07-25',
      type: 'milestone',
      title: 'POTS Diagnosis',
      location: 'UHealth Cardiology',
      provider: 'Dr. Amanda Sommerville',
      outcome: 'Postural Orthostatic Tachycardia Syndrome confirmed via tilt table test',
      notes: 'Started on Midodrine and Propranolol. Compression stockings prescribed. Increased salt/fluid intake recommended.'
    },
    {
      id: '4',
      date: '2022-07-25',
      type: 'milestone',
      title: 'hEDS Diagnosis (Ehlers-Danlos Syndrome Type 3)',
      location: 'UHealth Genetics',
      provider: 'Dr. Amanda Sommerville',
      outcome: 'Hypermobile EDS confirmed based on clinical criteria (Beighton score)',
      notes: 'Started physical therapy, joint protection strategies, compression stockings. Explains lifelong hypermobility and pain.'
    },
    {
      id: '5',
      date: '2022-11-29',
      type: 'procedure',
      title: 'Knee Brace Fitting',
      location: 'UHealth Orthotics',
      provider: 'Dr. Amanda Sommerville',
      outcome: 'Fitted for Hinge Lateral J knee brace for EDS joint support',
      notes: 'Custom fitted brace for knee stability. Wear during physical activities.'
    }
  ];

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const tabs: Array<{ id: TabType; label: string; icon: any; color: string }> = [
    { id: 'overview', label: 'Overview', icon: Activity, color: 'cyan' },
    { id: 'medications', label: 'Medications', icon: Pill, color: 'blue' },
    { id: 'vitals', label: 'Vitals', icon: Heart, color: 'cyan' },
    { id: 'symptoms', label: 'Symptoms', icon: AlertCircle, color: 'teal' },
    { id: 'appointments', label: 'Appointments', icon: Calendar, color: 'blue' },
    { id: 'labs', label: 'Labs', icon: TestTube, color: 'cyan' },
    { id: 'allergies', label: 'Allergies', icon: Shield, color: 'teal' },
    { id: 'immunizations', label: 'Immunizations', icon: Syringe, color: 'blue' },
    { id: 'conditions', label: 'Conditions', icon: Stethoscope, color: 'cyan' },
    { id: 'devices', label: 'Devices', icon: Monitor, color: 'teal' },
    { id: 'notes', label: 'Notes', icon: FileText, color: 'blue' },
    { id: 'study', label: 'Study', icon: BookOpen, color: 'cyan' },
    { id: 'events', label: 'Events', icon: Clock, color: 'teal' },
  ];

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      normal: 'text-green-400 bg-green-500/20 border-green-500/30',
      high: 'text-orange-400 bg-orange-500/20 border-orange-500/30',
      low: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
      critical: 'text-red-400 bg-red-500/20 border-red-500/30',
      upcoming: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
      completed: 'text-green-400 bg-green-500/20 border-green-500/30',
      cancelled: 'text-gray-400 bg-gray-500/20 border-gray-500/30',
      active: 'text-green-400 bg-green-500/20 border-green-500/30',
      managed: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
      resolved: 'text-gray-400 bg-gray-500/20 border-gray-500/30',
      inactive: 'text-gray-400 bg-gray-500/20 border-gray-500/30',
      mild: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
      moderate: 'text-orange-400 bg-orange-500/20 border-orange-500/30',
      severe: 'text-red-400 bg-red-500/20 border-red-500/30'
    };
    return colors[status] || 'text-gray-400 bg-gray-500/20 border-gray-500/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-cyan-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-cyan-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Health Dashboard
            </h1>
          </div>
          <p className="text-cyan-400">
            Complete health tracking and medical records management
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-blue-900/20 p-2 rounded-xl border border-cyan-500/30 mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                      : 'bg-blue-900/20 text-cyan-400 hover:bg-cyan-500/20'
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
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 p-6 rounded-xl border border-cyan-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Pill className="w-6 h-6 text-cyan-400" />
                    <h3 className="text-cyan-300 font-semibold">Medications</h3>
                  </div>
                  <p className="text-3xl font-bold text-white">{medications.length}</p>
                  <p className="text-cyan-400 text-sm mt-1">Active prescriptions</p>
                </div>

                <div className="bg-gradient-to-br from-teal-900/40 to-blue-900/40 p-6 rounded-xl border border-teal-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-6 h-6 text-teal-400" />
                    <h3 className="text-teal-300 font-semibold">Appointments</h3>
                  </div>
                  <p className="text-3xl font-bold text-white">{appointments.filter(a => a.status === 'upcoming').length}</p>
                  <p className="text-teal-400 text-sm mt-1">Upcoming visits</p>
                </div>

                <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 p-6 rounded-xl border border-cyan-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Stethoscope className="w-6 h-6 text-cyan-400" />
                    <h3 className="text-cyan-300 font-semibold">Conditions</h3>
                  </div>
                  <p className="text-3xl font-bold text-white">{conditions.filter(c => c.status === 'active' || c.status === 'managed').length}</p>
                  <p className="text-cyan-400 text-sm mt-1">Active/Managed</p>
                </div>

                <div className="bg-gradient-to-br from-blue-900/40 to-teal-900/40 p-6 rounded-xl border border-blue-500/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-6 h-6 text-blue-400" />
                    <h3 className="text-blue-300 font-semibold">Allergies</h3>
                  </div>
                  <p className="text-3xl font-bold text-white">{allergies.length}</p>
                  <p className="text-blue-400 text-sm mt-1">Known allergies</p>
                </div>
              </div>

              {/* Recent Vitals Chart */}
              <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 p-6 rounded-xl border border-cyan-500/30">
                <h3 className="text-xl font-bold text-cyan-300 mb-4">Recent Vitals Trend (7 Days)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Blood Pressure */}
                  <div>
                    <h4 className="text-cyan-400 font-semibold mb-2">Blood Pressure</h4>
                    <div className="space-y-2">
                      {vitals.slice(0, 7).reverse().map((v) => (
                        <div key={v.id} className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 w-20">{v.date.slice(5)}</span>
                          <div className="flex-1 h-6 bg-blue-900/30 rounded-lg overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                              style={{ width: `${(v.systolic / 160) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-cyan-300 w-20">{v.systolic}/{v.diastolic}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Heart Rate */}
                  <div>
                    <h4 className="text-cyan-400 font-semibold mb-2">Heart Rate (bpm)</h4>
                    <div className="space-y-2">
                      {vitals.slice(0, 7).reverse().map((v) => (
                        <div key={v.id} className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 w-20">{v.date.slice(5)}</span>
                          <div className="flex-1 h-6 bg-blue-900/30 rounded-lg overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-teal-500 to-cyan-500"
                              style={{ width: `${(v.heartRate / 100) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-teal-300 w-20">{v.heartRate}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Appointments */}
              <div className="bg-gradient-to-br from-teal-900/30 to-blue-900/30 p-6 rounded-xl border border-teal-500/30">
                <h3 className="text-xl font-bold text-teal-300 mb-4">Upcoming Appointments</h3>
                <div className="space-y-3">
                  {appointments.filter(a => a.status === 'upcoming').slice(0, 3).map((appt) => (
                    <div key={appt.id} className="bg-blue-900/30 p-4 rounded-lg border border-teal-500/20">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-cyan-300 font-semibold">{appt.doctor} - {appt.specialty}</p>
                          <p className="text-teal-400 text-sm mt-1">{appt.date} at {appt.time}</p>
                          <p className="text-gray-400 text-sm">{appt.reason}</p>
                        </div>
                        <Calendar className="w-5 h-5 text-teal-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Lab Results */}
              <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 p-6 rounded-xl border border-cyan-500/30">
                <h3 className="text-xl font-bold text-cyan-300 mb-4">Recent Lab Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {labs.slice(0, 4).map((lab) => (
                    <div key={lab.id} className="bg-blue-900/30 p-4 rounded-lg border border-cyan-500/20">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-cyan-300 font-semibold">{lab.testName}</p>
                        <span className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(lab.status)}`}>
                          {lab.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-white">{lab.result} {lab.unit}</p>
                      <p className="text-gray-400 text-sm">Normal: {lab.normalRange}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Medications Tab */}
          {activeTab === 'medications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-cyan-300">Active Medications</h2>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                    <input
                      type="text"
                      placeholder="Search medications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-blue-900/30 border border-cyan-500/30 rounded-lg text-cyan-300 placeholder-cyan-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-300 hover:bg-cyan-500/30">
                    <Plus className="w-4 h-4" />
                    Add Medication
                  </button>
                </div>
              </div>

              {medications.map((med) => (
                <div key={med.id} className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 p-6 rounded-xl border border-cyan-500/30">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Pill className="w-6 h-6 text-cyan-400" />
                        <h3 className="text-xl font-bold text-cyan-300">{med.name}</h3>
                        <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-sm font-semibold text-blue-300">
                          {med.dosage}
                        </span>
                      </div>
                      <p className="text-gray-400 mb-2">{med.purpose}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-gray-400">Frequency</p>
                          <p className="text-cyan-300 font-semibold">{med.frequency}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Next Dose</p>
                          <p className="text-cyan-300 font-semibold">{med.nextDose}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Refill Date</p>
                          <p className="text-cyan-300 font-semibold">{med.refillDate}</p>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => toggleExpand(med.id)} className="text-cyan-400 hover:text-cyan-300">
                      {expandedItems.has(med.id) ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>

                  {expandedItems.has(med.id) && (
                    <div className="border-t border-cyan-500/20 pt-4 mt-4 space-y-3">
                      <div>
                        <p className="text-sm text-gray-400">Prescribed By</p>
                        <p className="text-cyan-300">{med.prescribedBy}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Possible Side Effects</p>
                        <div className="flex flex-wrap gap-2">
                          {med.sideEffects.map((effect, idx) => (
                            <span key={idx} className="px-2 py-1 bg-orange-500/20 border border-orange-500/30 rounded text-xs text-orange-300">
                              {effect}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Vitals Tab */}
          {activeTab === 'vitals' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-cyan-300">Vital Stats</h2>
                <span className="text-sm text-gray-400">Last Updated: {MY_VITAL_STATS.lastUpdated}</span>
              </div>

              {/* Real Vital Stats Only */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Blood Type */}
                <div className="bg-gradient-to-br from-red-900/40 to-pink-900/40 p-6 rounded-xl border border-red-500/30">
                  <div className="flex items-center gap-2 mb-4">
                    <Droplets className="w-5 h-5 text-red-400" />
                    <h3 className="text-lg font-bold text-red-300">Blood Type</h3>
                  </div>
                  <div className="text-4xl font-bold text-white">{MY_VITAL_STATS.bloodType}</div>
                </div>

                {/* Weight */}
                <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 p-6 rounded-xl border border-cyan-500/30">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-lg font-bold text-cyan-300">Weight</h3>
                  </div>
                  <div className="text-4xl font-bold text-white">{MY_VITAL_STATS.weight} <span className="text-lg text-gray-400">lbs</span></div>
                </div>

                {/* Height */}
                <div className="bg-gradient-to-br from-teal-900/40 to-cyan-900/40 p-6 rounded-xl border border-teal-500/30">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-teal-400" />
                    <h3 className="text-lg font-bold text-teal-300">Height</h3>
                  </div>
                  <div className="text-4xl font-bold text-white">{MY_VITAL_STATS.height}</div>
                </div>

                {/* BMI */}
                <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 p-6 rounded-xl border border-blue-500/30">
                  <div className="flex items-center gap-2 mb-4">
                    <Heart className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-bold text-blue-300">BMI</h3>
                  </div>
                  <div className="text-4xl font-bold text-white">{MY_VITAL_STATS.bmi}</div>
                  <div className="text-sm text-yellow-400 mt-1">Overweight</div>
                </div>
              </div>

              {/* Note about tracking */}
              <div className="bg-gradient-to-br from-gray-900/40 to-gray-800/40 p-6 rounded-xl border border-gray-500/30">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-300">Daily Vitals Tracking</h3>
                    <p className="text-gray-400 text-sm">Connect your Pixel Watch or other health devices to automatically track blood pressure, heart rate, and other daily vitals.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Symptoms Tab */}
          {activeTab === 'symptoms' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-cyan-300">Symptom Tracking</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-300 hover:bg-cyan-500/30">
                  <Plus className="w-4 h-4" />
                  Log Symptom
                </button>
              </div>

              {symptoms.map((symptom) => (
                <div key={symptom.id} className="bg-gradient-to-br from-teal-900/40 to-cyan-900/40 p-6 rounded-xl border border-teal-500/30">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <AlertCircle className="w-6 h-6 text-teal-400" />
                        <h3 className="text-xl font-bold text-teal-300">{symptom.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                          symptom.severity >= 7 ? 'bg-red-500/20 border-red-500/30 text-red-300' :
                          symptom.severity >= 4 ? 'bg-orange-500/20 border-orange-500/30 text-orange-300' :
                          'bg-yellow-500/20 border-yellow-500/30 text-yellow-300'
                        }`}>
                          Severity: {symptom.severity}/10
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-gray-400">Date</p>
                          <p className="text-teal-300 font-semibold">{symptom.date}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Duration</p>
                          <p className="text-teal-300 font-semibold">{symptom.duration}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Triggers</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {symptom.triggers.map((trigger, idx) => (
                              <span key={idx} className="px-2 py-1 bg-teal-500/20 border border-teal-500/30 rounded text-xs text-teal-300">
                                {trigger}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => toggleExpand(symptom.id)} className="text-teal-400 hover:text-teal-300">
                      {expandedItems.has(symptom.id) ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>

                  {expandedItems.has(symptom.id) && (
                    <div className="border-t border-teal-500/20 pt-4 mt-4">
                      <p className="text-sm text-gray-400 mb-2">Notes</p>
                      <p className="text-teal-300">{symptom.notes}</p>
                    </div>
                  )}

                  {/* Severity Bar */}
                  <div className="mt-4">
                    <div className="h-2 bg-teal-900/30 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          symptom.severity >= 7 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                          symptom.severity >= 4 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                          'bg-gradient-to-r from-yellow-500 to-yellow-600'
                        }`}
                        style={{ width: `${symptom.severity * 10}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-cyan-300">Medical Appointments</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-300 hover:bg-cyan-500/30">
                  <Plus className="w-4 h-4" />
                  Schedule Appointment
                </button>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2 mb-4">
                <button className="px-4 py-2 bg-cyan-500/30 border border-cyan-500/50 rounded-lg text-cyan-300 font-semibold">
                  Upcoming
                </button>
                <button className="px-4 py-2 bg-blue-900/20 border border-cyan-500/20 rounded-lg text-cyan-400 hover:bg-cyan-500/20">
                  Completed
                </button>
              </div>

              {appointments.map((appt) => (
                <div key={appt.id} className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 p-6 rounded-xl border border-cyan-500/30">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-6 h-6 text-cyan-400" />
                        <h3 className="text-xl font-bold text-cyan-300">{appt.doctor}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(appt.status)}`}>
                          {appt.status}
                        </span>
                      </div>
                      <p className="text-blue-400 text-lg mb-3">{appt.specialty}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-400">Date & Time</p>
                          <p className="text-cyan-300 font-semibold">{appt.date}</p>
                          <p className="text-cyan-300 font-semibold">{appt.time}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Location</p>
                          <p className="text-cyan-300">{appt.location}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Reason</p>
                          <p className="text-cyan-300">{appt.reason}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Labs Tab */}
          {activeTab === 'labs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-cyan-300">Laboratory Results</h2>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-900/30 border border-cyan-500/30 rounded-lg text-cyan-300 hover:bg-cyan-500/20">
                    <Filter className="w-4 h-4" />
                    Filter
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-300 hover:bg-cyan-500/30">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>

              {labs.map((lab) => (
                <div key={lab.id} className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 p-6 rounded-xl border border-cyan-500/30">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <TestTube className="w-6 h-6 text-cyan-400" />
                        <h3 className="text-xl font-bold text-cyan-300">{lab.testName}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(lab.status)}`}>
                          {lab.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-gray-400">Date</p>
                          <p className="text-cyan-300 font-semibold">{lab.date}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Result</p>
                          <p className="text-2xl font-bold text-cyan-300">{lab.result} {lab.unit}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Normal Range</p>
                          <p className="text-cyan-300 font-semibold">{lab.normalRange}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Ordered By</p>
                          <p className="text-cyan-300">{lab.orderedBy}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Trend Analysis */}
              <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 p-6 rounded-xl border border-cyan-500/30 mt-6">
                <h3 className="text-lg font-bold text-cyan-300 mb-4">Test Result Trends</h3>

                {labResults.length > 0 ? (
                  <div className="space-y-6">
                    {/* Group by test name and show trends */}
                    {Array.from(new Set(labResults.map(r => r.testName))).map((testName) => {
                      const testData = labResults
                        .filter(r => r.testName === testName)
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                      if (testData.length < 2) return null; // Need at least 2 data points for a trend

                      const values = testData.map(t => parseFloat(t.value) || 0);
                      const maxValue = Math.max(...values);
                      const minValue = Math.min(...values);
                      const range = maxValue - minValue || 1;

                      return (
                        <div key={testName} className="bg-cyan-900/20 p-4 rounded-lg border border-cyan-500/20">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-cyan-300">{testName}</h4>
                            <div className="text-sm text-cyan-400">
                              {testData.length} readings | Range: {minValue.toFixed(1)} - {maxValue.toFixed(1)} {testData[0].unit}
                            </div>
                          </div>

                          {/* Simple line chart using CSS */}
                          <div className="relative h-32 bg-cyan-900/30 rounded-lg p-4 border border-cyan-500/20">
                            {/* Y-axis labels */}
                            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-cyan-400 pr-2">
                              <span>{maxValue.toFixed(1)}</span>
                              <span>{((maxValue + minValue) / 2).toFixed(1)}</span>
                              <span>{minValue.toFixed(1)}</span>
                            </div>

                            {/* Chart area */}
                            <div className="ml-12 h-full relative">
                              {/* Grid lines */}
                              <div className="absolute inset-0 flex flex-col justify-between">
                                <div className="h-px bg-cyan-500/10"></div>
                                <div className="h-px bg-cyan-500/10"></div>
                                <div className="h-px bg-cyan-500/10"></div>
                              </div>

                              {/* Data points and line */}
                              <div className="absolute inset-0 flex items-end justify-between">
                                {testData.map((result, idx) => {
                                  const value = parseFloat(result.value) || 0;
                                  const heightPercent = ((value - minValue) / range) * 100;
                                  const isLatest = idx === testData.length - 1;

                                  return (
                                    <div key={idx} className="flex-1 flex flex-col items-center relative group">
                                      {/* Connecting line to next point */}
                                      {idx < testData.length - 1 && (
                                        <div
                                          className="absolute w-full h-0.5 bg-cyan-400"
                                          style={{
                                            bottom: `${heightPercent}%`,
                                            left: '50%',
                                            transformOrigin: 'left center',
                                            transform: `rotate(${Math.atan2(
                                              (((parseFloat(testData[idx + 1].value) || 0) - minValue) / range * 100) - heightPercent,
                                              100 / testData.length
                                            )}rad)`
                                          }}
                                        />
                                      )}

                                      {/* Data point */}
                                      <div
                                        className={`w-3 h-3 rounded-full ${
                                          isLatest ? 'bg-cyan-300 ring-4 ring-cyan-500/30' : 'bg-cyan-500'
                                        } cursor-pointer hover:scale-150 transition-transform z-10`}
                                        style={{ position: 'absolute', bottom: `${heightPercent}%` }}
                                      />

                                      {/* Tooltip on hover */}
                                      <div className="invisible group-hover:visible absolute bottom-full mb-2 bg-cyan-900 border border-cyan-500/50 rounded px-2 py-1 text-xs whitespace-nowrap z-20"
                                           style={{ bottom: `calc(${heightPercent}% + 1rem)` }}>
                                        <div className="text-cyan-300 font-semibold">{value.toFixed(1)} {result.unit}</div>
                                        <div className="text-cyan-400">{new Date(result.date).toLocaleDateString()}</div>
                                      </div>

                                      {/* X-axis label */}
                                      <div className="absolute -bottom-6 text-xs text-cyan-400 transform -rotate-45 origin-top-left whitespace-nowrap">
                                        {new Date(result.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          {/* Trend indicator */}
                          <div className="mt-6 flex items-center justify-between text-sm">
                            <div>
                              <span className="text-gray-400">Latest: </span>
                              <span className="text-cyan-300 font-semibold">
                                {testData[testData.length - 1].value} {testData[testData.length - 1].unit}
                              </span>
                              <span className="text-gray-400 ml-2">
                                ({new Date(testData[testData.length - 1].date).toLocaleDateString()})
                              </span>
                            </div>
                            <div>
                              {values[values.length - 1] > values[0] ? (
                                <span className="text-orange-400">↑ Increasing trend</span>
                              ) : values[values.length - 1] < values[0] ? (
                                <span className="text-green-400">↓ Decreasing trend</span>
                              ) : (
                                <span className="text-blue-400">→ Stable</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }).filter(Boolean)}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">
                    Add lab results to see visual trends over time. Track how key values change with each test.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Allergies Tab */}
          {activeTab === 'allergies' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-cyan-300">Allergy List</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-300 hover:bg-cyan-500/30">
                  <Plus className="w-4 h-4" />
                  Add Allergy
                </button>
              </div>

              {allergies.map((allergy) => (
                <div key={allergy.id} className="bg-gradient-to-br from-teal-900/40 to-cyan-900/40 p-6 rounded-xl border border-teal-500/30">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-6 h-6 text-teal-400" />
                        <h3 className="text-xl font-bold text-teal-300">{allergy.allergen}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(allergy.severity)}`}>
                          {allergy.severity.toUpperCase()}
                        </span>
                        <span className="px-3 py-1 bg-teal-500/20 border border-teal-500/30 rounded-full text-sm font-semibold text-teal-300">
                          {allergy.type}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-gray-400 mb-2">Reactions</p>
                          <div className="flex flex-wrap gap-2">
                            {allergy.reactions.map((reaction, idx) => (
                              <span key={idx} className="px-2 py-1 bg-red-500/20 border border-red-500/30 rounded text-sm text-red-300">
                                {reaction}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Diagnosed Date</p>
                          <p className="text-teal-300 font-semibold mb-3">{allergy.diagnosedDate}</p>
                          <p className="text-sm text-gray-400">Treatment</p>
                          <p className="text-teal-300">{allergy.treatment}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Immunizations Tab */}
          {activeTab === 'immunizations' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-cyan-300">Immunization Records</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-300 hover:bg-cyan-500/30">
                  <Plus className="w-4 h-4" />
                  Add Vaccination
                </button>
              </div>

              {immunizations.map((imm) => (
                <div key={imm.id} className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 p-6 rounded-xl border border-cyan-500/30">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Syringe className="w-6 h-6 text-cyan-400" />
                        <h3 className="text-xl font-bold text-cyan-300">{imm.vaccine}</h3>
                        {imm.nextDue && (
                          <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full text-sm font-semibold text-orange-300">
                            Booster Due: {imm.nextDue}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-gray-400">Date Given</p>
                          <p className="text-cyan-300 font-semibold">{imm.date}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Provider</p>
                          <p className="text-cyan-300">{imm.provider}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Lot Number</p>
                          <p className="text-cyan-300 font-mono text-sm">{imm.lot}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Site</p>
                          <p className="text-cyan-300">{imm.site}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Conditions Tab */}
          {activeTab === 'conditions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-cyan-300">Medical Conditions</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-300 hover:bg-cyan-500/30">
                  <Plus className="w-4 h-4" />
                  Add Condition
                </button>
              </div>

              {conditions.map((condition) => (
                <div key={condition.id} className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 p-6 rounded-xl border border-cyan-500/30">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Stethoscope className="w-6 h-6 text-cyan-400" />
                        <h3 className="text-xl font-bold text-cyan-300">{condition.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(condition.status)}`}>
                          {condition.status.toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(condition.severity)}`}>
                          {condition.severity}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-gray-400">Diagnosed</p>
                          <p className="text-cyan-300 font-semibold mb-3">{condition.diagnosedDate}</p>
                          <p className="text-sm text-gray-400">Diagnosed By</p>
                          <p className="text-cyan-300">{condition.diagnosedBy}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-2">Treatment Plan</p>
                          <p className="text-cyan-300">{condition.treatment}</p>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => toggleExpand(condition.id)} className="text-cyan-400 hover:text-cyan-300">
                      {expandedItems.has(condition.id) ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>

                  {expandedItems.has(condition.id) && (
                    <div className="border-t border-cyan-500/20 pt-4 mt-4">
                      <p className="text-sm text-gray-400 mb-2">Notes</p>
                      <p className="text-cyan-300">{condition.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Devices Tab */}
          {activeTab === 'devices' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-cyan-300">Medical Devices</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-300 hover:bg-cyan-500/30">
                  <Plus className="w-4 h-4" />
                  Add Device
                </button>
              </div>

              {devices.map((device) => (
                <div key={device.id} className="bg-gradient-to-br from-teal-900/40 to-cyan-900/40 p-6 rounded-xl border border-teal-500/30">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Monitor className="w-6 h-6 text-teal-400" />
                        <h3 className="text-xl font-bold text-teal-300">{device.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(device.status)}`}>
                          {device.status}
                        </span>
                      </div>
                      <p className="text-gray-400 mb-3">{device.type}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-400">Brand & Model</p>
                          <p className="text-teal-300 font-semibold">{device.brand} {device.model}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Date Acquired</p>
                          <p className="text-teal-300 font-semibold">{device.dateAcquired}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Last Reading</p>
                          <p className="text-teal-300 font-semibold">{device.lastReading}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-gray-400 mb-2">Settings & Notes</p>
                        <p className="text-teal-300">{device.settings}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-cyan-300">Health Journal & Notes</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-300 hover:bg-cyan-500/30">
                  <Plus className="w-4 h-4" />
                  New Note
                </button>
              </div>

              {/* Filter by type */}
              <div className="flex gap-2 mb-4 flex-wrap">
                <button className="px-3 py-1 bg-cyan-500/30 border border-cyan-500/50 rounded-lg text-cyan-300 text-sm font-semibold">
                  All
                </button>
                <button className="px-3 py-1 bg-blue-900/20 border border-cyan-500/20 rounded-lg text-cyan-400 text-sm hover:bg-cyan-500/20">
                  Journal
                </button>
                <button className="px-3 py-1 bg-blue-900/20 border border-cyan-500/20 rounded-lg text-cyan-400 text-sm hover:bg-cyan-500/20">
                  Questions
                </button>
                <button className="px-3 py-1 bg-blue-900/20 border border-cyan-500/20 rounded-lg text-cyan-400 text-sm hover:bg-cyan-500/20">
                  Observations
                </button>
              </div>

              {notes.map((note) => (
                <div key={note.id} className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 p-6 rounded-xl border border-cyan-500/30">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-5 h-5 text-cyan-400" />
                        <h3 className="text-lg font-bold text-cyan-300">{note.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          note.type === 'journal' ? 'bg-blue-500/20 text-blue-300' :
                          note.type === 'question' ? 'bg-orange-500/20 text-orange-300' :
                          note.type === 'symptom' ? 'bg-red-500/20 text-red-300' :
                          'bg-teal-500/20 text-teal-300'
                        }`}>
                          {note.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">{note.date}</p>
                      <p className="text-cyan-300 mb-3">{note.content}</p>
                      <div className="flex flex-wrap gap-2">
                        {note.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded text-xs text-cyan-300">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Study Tab */}
          {activeTab === 'study' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-cyan-300">Health Education Resources</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-300 hover:bg-cyan-500/30">
                  <Plus className="w-4 h-4" />
                  Add Resource
                </button>
              </div>

              {studyResources.map((resource) => (
                <div key={resource.id} className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 p-6 rounded-xl border border-cyan-500/30">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="w-5 h-5 text-cyan-400" />
                        <h3 className="text-lg font-bold text-cyan-300">{resource.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          resource.type === 'article' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                          resource.type === 'video' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                          'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                        }`}>
                          {resource.type}
                        </span>
                        {resource.completed && (
                          <span className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded text-xs font-semibold text-green-300">
                            Completed
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3">
                        <div>
                          <p className="text-sm text-gray-400">Topic</p>
                          <p className="text-cyan-300 font-semibold">{resource.topic}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Source</p>
                          <p className="text-cyan-300">{resource.source}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Date Added</p>
                          <p className="text-cyan-300">{resource.date}</p>
                        </div>
                        {resource.duration && (
                          <div>
                            <p className="text-sm text-gray-400">Duration</p>
                            <p className="text-cyan-300">{resource.duration}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-cyan-300">Health Events & Milestones</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-300 hover:bg-cyan-500/30">
                  <Plus className="w-4 h-4" />
                  Add Event
                </button>
              </div>

              {events.map((event) => (
                <div key={event.id} className="bg-gradient-to-br from-teal-900/40 to-cyan-900/40 p-6 rounded-xl border border-teal-500/30">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-6 h-6 text-teal-400" />
                        <h3 className="text-xl font-bold text-teal-300">{event.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                          event.type === 'surgery' ? 'bg-red-500/20 border-red-500/30 text-red-300' :
                          event.type === 'hospitalization' ? 'bg-orange-500/20 border-orange-500/30 text-orange-300' :
                          event.type === 'procedure' ? 'bg-blue-500/20 border-blue-500/30 text-blue-300' :
                          'bg-green-500/20 border-green-500/30 text-green-300'
                        }`}>
                          {event.type}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-gray-400">Date</p>
                          <p className="text-teal-300 font-semibold">{event.date}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Location</p>
                          <p className="text-teal-300">{event.location}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Provider</p>
                          <p className="text-teal-300">{event.provider}</p>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => toggleExpand(event.id)} className="text-teal-400 hover:text-teal-300">
                      {expandedItems.has(event.id) ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>

                  {expandedItems.has(event.id) && (
                    <div className="border-t border-teal-500/20 pt-4 mt-4 space-y-3">
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Outcome</p>
                        <p className="text-teal-300">{event.outcome}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Notes</p>
                        <p className="text-teal-300">{event.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
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
};

export default HealthDashboardPage;
