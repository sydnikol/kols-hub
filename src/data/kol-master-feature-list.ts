/**
 * KOL'S MASTER FEATURE LIST - LIFE, HEALTH & ACCESS SYSTEM
 * =========================================================
 * Comprehensive, trauma-informed, disability-centered life system
 * Based on: kol_master_feature_list_life_health_access_system.md
 *
 * This system exists to keep Kol alive, dignified, believed, and whole
 * inside a world that routinely fails disabled, Black, queer people.
 *
 * This is not excess. This is infrastructure.
 */

// ===== 1. CORE DESIGN PRINCIPLES (NON-NEGOTIABLE) =====
export const CORE_DESIGN_PRINCIPLES = {
  traumaInformed: {
    description: 'Trauma-informed by default (medical + racial + gendered trauma)',
    implementation: 'All UI/UX decisions consider trauma responses'
  },
  energyBased: {
    description: 'Energy-based, not time-based',
    implementation: 'Spoon theory integration throughout'
  },
  flareAware: {
    description: 'Everything degrades gracefully',
    implementation: 'System adapts to capacity levels'
  },
  noMoralLanguage: {
    description: 'No "lazy," "noncompliant," "failed"',
    implementation: 'Language audit on all copy'
  },
  consentFirst: {
    description: 'Consent-first data sharing',
    implementation: 'Granular permissions system'
  },
  redundancy: {
    description: 'Redundancy > efficiency (backups save lives)',
    implementation: 'Multiple backup systems'
  },
  writtenOverVerbal: {
    description: 'Written over verbal',
    implementation: 'All instructions in text format'
  },
  calmUX: {
    description: 'Calm, low-stim, non-punitive UX',
    implementation: 'Muted colors, no aggressive notifications'
  }
};

// ===== 2. IDENTITY & CONTEXT LAYER =====
export const IDENTITY_CONTEXT = {
  name: 'Kol',
  legalName: 'Sydney Lee Jones',
  pronouns: 'They/She',
  age: 26,
  identity: {
    cultural: 'Black',
    orientation: 'Queer',
    gender: 'Nonbinary',
    assignedAtBirth: 'AFAB',
    relationshipStyle: 'Polyamorous'
  },
  location: 'Kansas City, MO',
  primaryCareSystems: ['Truman Medical Centers', "Saint Luke's"],
  chosenFamily: [
    { name: 'Quincy', relationship: 'Partner', priority: 1 },
    { name: "Da'Veon", relationship: 'Partner', priority: 2 },
    { name: 'Mary Jones', relationship: 'Mother', priority: 3 }
  ],
  languagePreferences: {
    primaryLanguage: 'English',
    communicationStyle: 'Written preferred over verbal',
    processingNeeds: 'Extra time for complex information'
  },
  values: [
    'Autonomy',
    'Consent',
    'Authenticity',
    'Community care',
    'Rest as resistance'
  ],
  boundaries: [
    'No unsolicited advice',
    'Respect stated limits',
    'Check before physical contact',
    'Validate experiences without minimizing'
  ]
};

// ===== 3. HEALTH CONDITION REGISTRY =====
export const HEALTH_CONDITIONS_REGISTRY = [
  {
    name: 'Ehlers-Danlos Syndrome - Hypermobile Type (hEDS)',
    type: 'physical',
    category: 'Connective Tissue & Musculoskeletal',
    dailyBaseline: 'Joint instability, background pain 4-5/10',
    flareSymptoms: [
      'Increased subluxations/dislocations',
      'Pain spike to 7-9/10',
      'Severe fatigue',
      'Poor wound healing'
    ],
    triggers: ['Overexertion', 'Weather changes', 'Poor sleep', 'Stress'],
    accommodationsNeeded: [
      'Joint bracing',
      'Compression garments',
      'Activity pacing',
      'PT exercises'
    ],
    emergencyRelevance: 'Joints hypermobile - careful with positioning'
  },
  {
    name: 'Postural Orthostatic Tachycardia Syndrome (POTS)',
    type: 'autonomic',
    category: 'Autonomic & Cardiovascular',
    dailyBaseline: 'Managed with medication, some daily dizziness',
    flareSymptoms: [
      'Tachycardia (+30 bpm on standing)',
      'Syncope/near-syncope',
      'Visual changes',
      'Blood pooling',
      'Heat intolerance'
    ],
    triggers: ['Standing too long', 'Heat', 'Dehydration', 'Low salt', 'Stress'],
    accommodationsNeeded: [
      'Compression stockings',
      'High salt intake (3-5g/day)',
      'High fluid intake (2-3L/day)',
      'Gradual position changes',
      'Seated work options'
    ],
    emergencyRelevance: 'May need IV fluids, keep legs elevated'
  },
  {
    name: 'Seronegative Rheumatoid Arthritis / Inflammatory Arthritis',
    type: 'physical',
    category: 'Autoimmune',
    dailyBaseline: 'Managed with methotrexate, some joint stiffness',
    flareSymptoms: ['Joint swelling', 'Morning stiffness 1hr+', 'Fatigue', 'Systemic inflammation'],
    triggers: ['Infections', 'Stress', 'Weather', 'Missed medication'],
    accommodationsNeeded: ['Weekly methotrexate', 'Regular lab monitoring', 'Avoiding sick contacts'],
    emergencyRelevance: 'On immunosuppressant - watch for infection signs'
  },
  {
    name: 'Chronic Migraines',
    type: 'neurological',
    category: 'Neurological',
    dailyBaseline: '~8 migraine days/month with treatment',
    flareSymptoms: ['Visual aura', 'Severe headache', 'Photophobia', 'Phonophobia', 'Nausea'],
    triggers: ['Stress', 'Weather changes', 'Citrus', 'Bright lights', 'Lack of sleep', 'Dehydration'],
    accommodationsNeeded: ['Dark room access', 'Quiet environment', 'Rescue medication available'],
    emergencyRelevance: 'If symptoms differ from usual migraine, seek evaluation'
  },
  {
    name: 'Complex PTSD (C-PTSD)',
    type: 'psychiatric',
    category: 'Psychiatric / Neurodevelopmental',
    subtypes: ['Medical trauma', 'Abandonment trauma'],
    dailyBaseline: 'Managed with therapy and medication',
    flareSymptoms: ['Intrusive memories', 'Nightmares', 'Hypervigilance', 'Dissociation', 'Emotional dysregulation'],
    triggers: ['Medical settings', 'Dismissive providers', 'Abandonment cues', 'Unpredictability'],
    accommodationsNeeded: ['Trauma-informed care', 'Consistent providers', 'Written instructions', 'Processing time'],
    emergencyRelevance: 'Use calm tones only, no rushing, ask yes/no questions'
  },
  {
    name: 'AuDHD (Autism Spectrum + ADHD)',
    type: 'neurodevelopmental',
    category: 'Psychiatric / Neurodevelopmental',
    dailyBaseline: 'Managed with medication and accommodations',
    flareSymptoms: ['Executive dysfunction', 'Sensory overload', 'Meltdowns/shutdowns', 'Burnout'],
    triggers: ['Overstimulation', 'Unexpected changes', 'Social demands', 'Masking fatigue'],
    accommodationsNeeded: [
      'Sensory accommodations',
      'Routine predictability',
      'Reduced decision trees',
      'Body doubling',
      'Task chunking'
    ],
    emergencyRelevance: 'May need extra processing time, reduce stimulation'
  },
  {
    name: 'Depression',
    type: 'psychiatric',
    category: 'Psychiatric / Neurodevelopmental',
    dailyBaseline: 'Stable on medication',
    flareSymptoms: ['Low mood', 'Anhedonia', 'Fatigue', 'Sleep changes', 'Concentration difficulty'],
    triggers: ['Chronic illness flares', 'Isolation', 'Medical trauma', 'Seasonal changes'],
    accommodationsNeeded: ['Medication compliance support', 'Social connection', 'Activity pacing'],
    emergencyRelevance: 'Assess for safety if severe'
  },
  {
    name: 'Anxiety',
    type: 'psychiatric',
    category: 'Psychiatric / Neurodevelopmental',
    dailyBaseline: 'Managed with medication and coping skills',
    flareSymptoms: ['Excessive worry', 'Physical tension', 'Racing thoughts', 'Avoidance'],
    triggers: ['Medical appointments', 'Uncertainty', 'Chronic illness management stress'],
    accommodationsNeeded: ['Grounding techniques available', 'Predictability', 'Validation'],
    emergencyRelevance: 'Grounding techniques, calm environment'
  },
  {
    name: 'Asthma',
    type: 'physical',
    category: 'Respiratory',
    dailyBaseline: 'Well-controlled on controller inhaler',
    flareSymptoms: ['Wheezing', 'Shortness of breath', 'Chest tightness', 'Coughing'],
    triggers: ['Cold air', 'Exercise', 'Allergens', 'Respiratory infections'],
    accommodationsNeeded: ['Rescue inhaler access', 'Avoid triggers', 'Annual flu vaccine'],
    emergencyRelevance: 'Rescue inhaler in bag'
  },
  {
    name: 'Chronic GI Dysmotility',
    type: 'physical',
    category: 'Gastrointestinal',
    includes: ['GERD', 'Nausea', 'Constipation'],
    dailyBaseline: 'Requires daily management',
    flareSymptoms: ['Severe nausea', 'Reflux', 'Abdominal pain', 'Constipation'],
    triggers: ['Certain foods', 'Stress', 'Medications', 'Dehydration'],
    accommodationsNeeded: ['Daily Miralax', 'Dietary modifications', 'Anti-nausea medication available'],
    emergencyRelevance: 'Ondansetron available for nausea'
  },
  {
    name: 'Chronic Pain Syndrome',
    type: 'physical',
    category: 'Pain',
    dailyBaseline: 'Background pain 4-5/10, managed with multimodal approach',
    flareSymptoms: ['Pain 7-10/10', 'Reduced function', 'Sleep disruption', 'Mood impact'],
    triggers: ['Overexertion', 'Weather', 'Stress', 'Poor sleep', 'Inflammation'],
    accommodationsNeeded: ['Pacing', 'Rest access', 'Pain medication', 'Heat/cold therapy'],
    emergencyRelevance: 'Multifactorial - EDS, inflammation, neuropathic components'
  }
];

// ===== 4. MEDICATION & TREATMENT SYSTEM =====
export const MEDICATION_SYSTEM = {
  features: [
    'Master medication list (dose, timing, purpose)',
    'Weekly meds (methotrexate logic)',
    'Contraindications (e.g., folic acid timing)',
    'PRN logic',
    'Side-effect tracking',
    'Refill alerts',
    '"Did I take this?" confirmation',
    'Caregiver verification option'
  ],
  weeklyMedicationLogic: {
    methotrexate: {
      day: 'Monday',
      dose: '15mg (6 x 2.5mg tablets)',
      instructions: 'Empty stomach, no folic acid same day',
      warnings: ['Immunosuppressant', 'Avoid alcohol', 'Watch for infection signs']
    },
    folicAcid: {
      schedule: 'Daily EXCEPT Monday',
      dose: '1mg',
      purpose: 'Reduces methotrexate side effects'
    }
  },
  prnMedications: [
    { name: 'Albuterol', purpose: 'Asthma rescue' },
    { name: 'Ondansetron', purpose: 'Nausea' },
    { name: 'Cyclobenzaprine', purpose: 'Muscle spasms' },
    { name: 'Meloxicam', purpose: 'Pain/inflammation' },
    { name: 'Sumatriptan', purpose: 'Acute migraine' },
    { name: 'MiraLAX', purpose: 'Constipation' },
    { name: 'Medical cannabis', purpose: 'Pain & nausea' }
  ]
};

// ===== 5. SYMPTOM & FLARE TRACKING =====
export const SYMPTOM_TRACKING = {
  dailyBodyScan: [
    'Pain (0-10 scale with location)',
    'Dizziness',
    'Nausea',
    'Fatigue',
    'Cognitive status (brain fog, dissociation)',
    'Emotional load'
  ],
  specialTracking: [
    'Visual migraine tracking',
    'POTS episode logging',
    'Trigger correlation'
  ],
  exportableReports: true,
  doctorReadyFormat: true
};

// ===== 6. ENERGY (SPOON) ACCOUNTING SYSTEM =====
export const SPOON_ACCOUNTING = {
  dailyAvailableSpoons: 12,
  flareAdjustment: -4,
  mandatoryCosts: [
    { activity: 'Taking medications', spoons: 1 },
    { activity: 'Eating meal', spoons: 1 },
    { activity: 'Basic hygiene', spoons: 1-2 }
  ],
  optionalCosts: [
    { activity: 'Social activity', spoons: 2-4 },
    { activity: 'Creative work', spoons: 2-3 },
    { activity: 'Admin tasks', spoons: 2-3 }
  ],
  borrowedSpoons: {
    description: 'Support from others',
    examples: ['Partner helps with meal prep', 'Friend drives to appointment']
  },
  crashPrediction: true,
  postExertionalTracking: true
};

// ===== 7. DAILY LIVING SUPPORT FEATURES =====
export const DAILY_LIVING_SUPPORT = {
  eatingReminders: {
    enabled: true,
    choiceLimitation: true,
    description: 'Reminders with limited options to reduce decision fatigue'
  },
  hydrationTracking: {
    dailyGoal: '2-3L',
    electrolytesReminder: true,
    alerts: true
  },
  saltIntakeTracking: {
    dailyGoal: '3-5g for POTS',
    mealLogging: true
  },
  showerSafetyChecks: {
    seated: true,
    temperatureWarnings: true,
    durationLimits: true
  },
  ptReminders: {
    enabled: true,
    pacingRules: true,
    flareModifications: true
  },
  restEnforcement: {
    noGuiltLanguage: true,
    description: 'Scheduled rest without productivity shame'
  }
};

// ===== 8. EMERGENCY & CRISIS MODULE =====
export const EMERGENCY_MODULE = {
  emergencyCard: {
    lockScreenReady: true,
    contents: [
      'Name, pronouns, DOB',
      'Emergency contacts',
      'Key conditions',
      'Allergies',
      'Current medications',
      'Hospital preference'
    ]
  },
  freezeShutdownProtocol: {
    steps: [
      'Recognize signs (freeze, dissociation)',
      'Reduce stimulation',
      'Grounding techniques',
      'Contact support person'
    ]
  },
  whoToCallOrder: [
    { name: 'Quincy', relationship: 'Partner' },
    { name: "Da'Veon", relationship: 'Partner' },
    { name: 'Mary Jones', relationship: 'Mother' }
  ],
  hospitalPreference: "Saint Luke's or Truman Medical Centers",
  medicationSnapshot: true,
  consentNotes: true,
  crisisDebriefLogging: true
};

// ===== 9. CARE TEAM COORDINATION =====
export const CARE_TEAM_COORDINATION = {
  providerDirectory: [
    { name: 'Amanda Sommerville', role: 'Primary Care', facility: 'Truman' },
    { name: 'Dr. John Lee', role: 'Cardiology', facility: "Saint Luke's" },
    { name: 'Sarah Ifteqar', role: 'Rheumatology' },
    { name: 'Fei Cao', role: 'Pain Management' },
    { name: 'Gastroenterology', role: 'GI', facility: 'Truman' },
    { name: 'Dr. Salma Velazquez', role: 'Psychiatry' },
    { name: 'Bridgit Banks', role: 'Therapy' },
    { name: 'Kinesphere', role: 'Physical Therapy' }
  ],
  appointmentTracking: true,
  prepNotes: true,
  postAppointmentDebrief: true,
  taskFollowUps: true,
  sharedAccessWithConsent: true,
  documentationVault: true
};

// ===== 10. PARTNER & CAREGIVER INTERFACES =====
export const CAREGIVER_INTERFACES = {
  separateViews: ['Quincy', "Da'Veon", 'Mom', 'Home Health Aide'],
  features: {
    whatHelpsWhatHarms: true,
    dailyCheckInScripts: true,
    taskDelegation: true,
    boundaryReminders: true,
    noAskReplenishmentLists: true
  }
};

// ===== 11. TRAUMA-INFORMED COMMUNICATION TOOLS =====
export const TRAUMA_INFORMED_COMMUNICATION = {
  scriptLibrary: {
    categories: ['Medical', 'Family', 'Systems', 'Self-advocacy']
  },
  toneSelector: ['Calm', 'Firm', 'Warm'],
  noFixVentMode: {
    description: 'Listening without offering solutions',
    enabled: true
  },
  validationPrompts: true,
  meltdownShutdownLanguage: {
    phrases: [
      'I notice you may need a break',
      'It\'s okay to pause',
      'What do you need right now?',
      'I\'m here when you\'re ready'
    ]
  }
};

// ===== 12. ACCESSIBILITY ENGINE =====
export const ACCESSIBILITY_ENGINE = {
  sensoryControls: {
    light: 'Adjustable brightness and contrast',
    sound: 'Volume control, notification sounds toggle',
    textDensity: 'Adjustable font size and spacing'
  },
  lowCapacityMode: {
    oneTap: true,
    description: 'Simplifies interface immediately'
  },
  voiceFreeOperation: true,
  visualSimplicity: true,
  predictableNavigation: true,
  noSurpriseNotifications: true
};

// ===== 13. COGNITIVE SUPPORT (AUDHD) =====
export const COGNITIVE_SUPPORT = {
  taskChunking: true,
  bodyDoublingMode: true,
  visualSchedules: true,
  memoryAids: true,
  reducedDecisionTrees: true,
  hyperfocusProtection: {
    breakReminders: true,
    hydrationAlerts: true
  },
  burnoutDetection: true
};

// ===== 14. MEDICAL TRAUMA SAFEGUARDS =====
export const MEDICAL_TRAUMA_SAFEGUARDS = {
  redFlagPhraseDetection: {
    phrases: [
      'It\'s all in your head',
      'You\'re too young for that',
      'Have you tried yoga?',
      'You don\'t look sick',
      'It\'s just anxiety'
    ],
    action: 'Flag and document'
  },
  providerBehaviorNotes: true,
  appointmentEmotionalRating: true,
  recoveryTimeEnforcement: true,
  whiteCoatSyndromeAccommodations: true
};

// ===== 15. DOCUMENTATION & EVIDENCE VAULT =====
export const DOCUMENTATION_VAULT = {
  categories: [
    'Diagnoses',
    'Test results',
    'Letters',
    'Disability filings',
    'Appeals',
    'Hearing prep'
  ],
  exportablePackets: true,
  secureStorage: true
};

// ===== 16. LEGAL & DISABILITY SUPPORT =====
export const LEGAL_DISABILITY_SUPPORT = {
  disabilityStatusTracking: true,
  appealTimelines: true,
  evidenceChecklists: true,
  costDocumentation: true,
  impactStatements: true,
  attorneyAdvocateContacts: true
};

// ===== 17. COMMUNITY & MUTUAL AID LAYER =====
export const COMMUNITY_MUTUAL_AID = {
  trustedHelpersList: true,
  whatTheyCanHelpWith: true,
  capacityBasedAsks: true,
  noReplyNeededCheckIns: true,
  mutualAidTracking: true
};

// ===== 18. EMOTIONAL REGULATION TOOLKIT =====
export const EMOTIONAL_REGULATION = {
  groundingExercises: [
    '5-4-3-2-1 senses',
    'Temperature grounding (cold water)',
    'Box breathing',
    'Body scan'
  ],
  coRegulationScripts: true,
  breathingTimers: true,
  sensoryKits: {
    items: ['Fidget toys', 'Weighted blanket', 'Comfort textures', 'Calming scents']
  },
  safePlaylists: true,
  affirmationLibrary: true
};

// ===== 19. JOY, IDENTITY & MEANING =====
export const JOY_IDENTITY_MEANING = {
  creativeOutlets: ['Art', 'Writing', 'Music', 'Gaming', 'Zine making'],
  hyperfixations: {
    tracking: true,
    supportive: true
  },
  mediaTracking: ['Anime', 'Games', 'Books', 'Shows'],
  rituals: true,
  pleasureWithoutProductivity: {
    description: 'Rest and joy are not earned',
    enabled: true
  },
  desireSexuality: {
    description: 'Non-medicalized tracking',
    consentBased: true
  }
};

// ===== 20. SPIRITUAL & CULTURAL CARE =====
export const SPIRITUAL_CULTURAL_CARE = {
  ancestralPractices: true,
  hoodooRitualNotes: true,
  griefRituals: true,
  protectionPractices: true,
  meaningMaking: true
};

// ===== 21. PRIVACY, CONSENT & CONTROL =====
export const PRIVACY_CONSENT_CONTROL = {
  granularSharingPermissions: true,
  roleBasedAccess: true,
  timeLimitedVisibility: true,
  emergencyOverrideOnlyWhenNeeded: true
};

// ===== 22. SYSTEM DEGRADATION MODES =====
export const SYSTEM_DEGRADATION_MODES = {
  modes: [
    {
      name: 'Full Capacity',
      description: 'All features available',
      spoonThreshold: '8+'
    },
    {
      name: 'Low Energy',
      description: 'Simplified interface, essential features only',
      spoonThreshold: '4-7'
    },
    {
      name: 'Flare Day',
      description: 'Minimal interface, rest-focused',
      spoonThreshold: '2-3'
    },
    {
      name: 'Crisis Mode',
      description: 'Emergency contacts and essential info only',
      spoonThreshold: '0-1'
    },
    {
      name: 'Post-Crisis Recovery',
      description: 'Gentle reintegration, no demands',
      spoonThreshold: 'Recovering'
    }
  ],
  automaticFeatureLimiting: true
};

// ===== 23. META: SYSTEM SELF-MAINTENANCE =====
export const SYSTEM_SELF_MAINTENANCE = {
  questions: [
    "What's outdated?",
    "What's missing?",
    'What needs simplification?',
    'What is no longer serving survival?'
  ],
  periodicReview: true,
  userFeedbackIntegration: true
};

// ===== CLOSING STATEMENT =====
export const SYSTEM_PURPOSE = {
  statement: 'This system exists to keep Kol alive, dignified, believed, and whole inside a world that routinely fails disabled, Black, queer people. Convenience is optional. Safety is not.',
  mantra: 'This is not excess. This is infrastructure.'
};

// ===== FEATURE STATUS TRACKING =====
export const FEATURE_STATUS = {
  implemented: [
    'Health Condition Registry',
    'Medication System',
    'Symptom Tracking',
    'Spoon Accounting',
    'Emergency Module',
    'Care Team Coordination',
    'Daily Living Support',
    'Entertainment & Gaming',
    'Spiritual & Cultural Care',
    'Creative Expression',
    'Financial Management'
  ],
  inProgress: [
    'Partner & Caregiver Interfaces',
    'Trauma-Informed Communication Tools',
    'Accessibility Engine',
    'System Degradation Modes'
  ],
  planned: [
    'Medical Trauma Safeguards',
    'Legal & Disability Support',
    'Community & Mutual Aid Layer',
    'System Self-Maintenance'
  ],
  totalCategories: 23,
  implementedPercentage: '48%'
};

// Export all modules
export const KOL_MASTER_SYSTEM = {
  designPrinciples: CORE_DESIGN_PRINCIPLES,
  identity: IDENTITY_CONTEXT,
  healthConditions: HEALTH_CONDITIONS_REGISTRY,
  medications: MEDICATION_SYSTEM,
  symptoms: SYMPTOM_TRACKING,
  spoons: SPOON_ACCOUNTING,
  dailyLiving: DAILY_LIVING_SUPPORT,
  emergency: EMERGENCY_MODULE,
  careTeam: CARE_TEAM_COORDINATION,
  caregivers: CAREGIVER_INTERFACES,
  communication: TRAUMA_INFORMED_COMMUNICATION,
  accessibility: ACCESSIBILITY_ENGINE,
  cognitive: COGNITIVE_SUPPORT,
  medicalTraumaSafeguards: MEDICAL_TRAUMA_SAFEGUARDS,
  documentation: DOCUMENTATION_VAULT,
  legal: LEGAL_DISABILITY_SUPPORT,
  community: COMMUNITY_MUTUAL_AID,
  emotionalRegulation: EMOTIONAL_REGULATION,
  joy: JOY_IDENTITY_MEANING,
  spiritual: SPIRITUAL_CULTURAL_CARE,
  privacy: PRIVACY_CONSENT_CONTROL,
  degradationModes: SYSTEM_DEGRADATION_MODES,
  maintenance: SYSTEM_SELF_MAINTENANCE,
  purpose: SYSTEM_PURPOSE,
  status: FEATURE_STATUS
};

export default KOL_MASTER_SYSTEM;
