/**
 * SYDNEY JONES - COMPLETE HEALTH PROFILE
 * =======================================
 * Comprehensive medical information extracted from:
 * - myUHealth University Health Portal (Nov 2025)
 * - Children's Mercy Health Records
 * - Saint Luke's Visit Records
 * - Various specialist records
 *
 * CONFIDENTIAL - Personal Health Information
 */

// ===== PERSONAL INFORMATION =====
export const PATIENT_INFO = {
  fullName: 'Sydney Lee Jones',
  preferredName: 'Sydney',
  dateOfBirth: new Date('1999-09-07'),
  age: 26,
  sex: 'Female',
  gender: 'Non-binary/Transgender',
  pronouns: 'They/Them',
  address: {
    street: '317 Olive St Apt 1',
    city: 'Kansas City',
    state: 'MO',
    zip: '64124',
    country: 'USA'
  },
  contact: {
    phone: '913-638-8640',
    email: 'kol.health1999@gmail.com',
    emergencyContact: {
      name: 'Mary Jones',
      relationship: 'Mother',
      phone: '913-638-8640'
    }
  },
  insurance: {
    primary: 'Medicaid',
    memberId: 'MO-MEDICAID-JONES'
  }
};

// ===== VITAL STATISTICS =====
export const VITAL_STATS = {
  bloodType: 'A Positive',
  height: {
    feet: 5,
    inches: 5,
    cm: 165.1
  },
  weight: {
    lbs: 160.50,
    kg: 72.8
  },
  bmi: 26.7,
  bmiCategory: 'Overweight',
  lastUpdated: new Date('2025-10-17'),
  recentVitals: {
    bloodPressure: {
      systolic: 118,
      diastolic: 78,
      date: new Date('2025-11-05')
    },
    heartRate: {
      bpm: 82,
      date: new Date('2025-11-05')
    },
    respiratoryRate: {
      perMinute: 16,
      date: new Date('2025-11-05')
    },
    temperature: {
      fahrenheit: 98.6,
      celsius: 37.0,
      date: new Date('2025-11-05')
    },
    oxygenSaturation: {
      percent: 98,
      date: new Date('2025-11-05')
    }
  }
};

// ===== ALLERGIES =====
export const ALLERGIES = [
  {
    allergen: 'Ketorolac',
    type: 'Medication',
    reaction: 'Swelling',
    severity: 'Moderate',
    dateIdentified: new Date('2023-10-01'),
    notes: 'NSAID - Avoid all ketorolac products'
  },
  {
    allergen: 'Oranges',
    type: 'Food',
    reaction: 'Migraine trigger',
    severity: 'Mild',
    dateIdentified: new Date('2024-01-15'),
    notes: 'Citrus fruits may trigger migraines'
  },
  {
    allergen: 'Latex',
    type: 'Environmental',
    reaction: 'Contact dermatitis, skin irritation',
    severity: 'Moderate',
    dateIdentified: new Date('2020-06-01'),
    notes: 'Use non-latex gloves for medical procedures'
  },
  {
    allergen: 'Penicillin',
    type: 'Medication',
    reaction: 'Suspected - needs confirmation',
    severity: 'Unknown',
    dateIdentified: new Date('2010-01-01'),
    notes: 'Childhood reaction reported by parents'
  }
];

// ===== HEALTH CONDITIONS =====
export const HEALTH_CONDITIONS = [
  // Connective Tissue
  {
    name: 'Ehlers-Danlos Syndrome, Hypermobile Type (hEDS)',
    icdCode: 'M35.7',
    category: 'Connective Tissue',
    status: 'Active - Chronic',
    diagnosisDate: new Date('2022-07-25'),
    diagnosedBy: 'Genetics Specialist',
    symptoms: [
      'Joint hypermobility',
      'Frequent dislocations/subluxations',
      'Chronic pain',
      'Easy bruising',
      'Slow wound healing',
      'Skin hyperextensibility',
      'Fatigue'
    ],
    management: [
      'Physical therapy',
      'Joint bracing/support',
      'Pain management',
      'Activity modification',
      'Compression garments'
    ],
    notes: 'Affects multiple body systems. Requires multidisciplinary care.'
  },
  // Autonomic
  {
    name: 'Postural Orthostatic Tachycardia Syndrome (POTS)',
    icdCode: 'G90.A',
    category: 'Autonomic/Cardiovascular',
    status: 'Active - Managed',
    diagnosisDate: new Date('2023-07-25'),
    diagnosedBy: 'Cardiologist',
    symptoms: [
      'Tachycardia upon standing',
      'Dizziness/lightheadedness',
      'Syncope/near-syncope',
      'Exercise intolerance',
      'Brain fog',
      'Fatigue',
      'Blood pooling in extremities'
    ],
    management: [
      'Midodrine 2.5mg TID',
      'Propranolol 20mg BID',
      'Compression stockings (thigh-high)',
      'Increased salt intake (3-5g/day)',
      'Increased fluid intake (2-3L/day)',
      'Counter-maneuvers',
      'Gradual position changes'
    ],
    notes: 'Common comorbidity with EDS. Managed well with current regimen.'
  },
  // Autoimmune
  {
    name: 'Seronegative Rheumatoid Arthritis',
    icdCode: 'M06.00',
    category: 'Autoimmune/Rheumatological',
    status: 'Active - Under Treatment',
    diagnosisDate: new Date('2025-05-13'),
    diagnosedBy: 'Dr. Sarah Ifteqar - Rheumatology',
    symptoms: [
      'Joint pain and swelling',
      'Morning stiffness',
      'Fatigue',
      'Systemic inflammation'
    ],
    management: [
      'Methotrexate 15mg weekly',
      'Folic acid supplementation',
      'Regular lab monitoring',
      'Anti-inflammatory diet'
    ],
    notes: 'RF negative, but clinical presentation consistent with RA. Good response to MTX.'
  },
  // Neurological
  {
    name: 'Chronic Migraine',
    icdCode: 'G43.709',
    category: 'Neurological',
    status: 'Active - Managed',
    diagnosisDate: new Date('2017-05-28'),
    diagnosedBy: 'Dr. Parashar Koirala - Neurology',
    symptoms: [
      'Severe headaches (>15 days/month)',
      'Photophobia',
      'Phonophobia',
      'Nausea',
      'Aura (visual)',
      'Cognitive impairment during episodes'
    ],
    management: [
      'Emgality 120mg monthly injection',
      'Topiramate 50mg daily',
      'Sumatriptan 50mg PRN',
      'Trigger avoidance',
      'Sleep hygiene'
    ],
    triggers: ['Stress', 'Weather changes', 'Citrus', 'Bright lights', 'Lack of sleep', 'Dehydration'],
    notes: 'Significant improvement with Emgality. Down from 20+ migraine days to ~8/month.'
  },
  // Mental Health
  {
    name: 'Post-Traumatic Stress Disorder (PTSD)',
    icdCode: 'F43.10',
    category: 'Mental Health',
    status: 'Active - In Treatment',
    diagnosisDate: new Date('2020-03-15'),
    symptoms: [
      'Intrusive memories',
      'Nightmares',
      'Hypervigilance',
      'Avoidance behaviors',
      'Emotional dysregulation'
    ],
    management: [
      'Trauma-focused therapy',
      'EMDR',
      'Medication management',
      'Grounding techniques'
    ],
    notes: 'Making progress with therapy. Triggers identified and being worked through.'
  },
  {
    name: 'Major Depressive Disorder',
    icdCode: 'F33.1',
    category: 'Mental Health',
    status: 'Active - Managed',
    diagnosisDate: new Date('2016-01-01'),
    management: [
      'Duloxetine 60mg daily',
      'Mirtazapine 30mg at bedtime',
      'Therapy',
      'Exercise when able'
    ],
    notes: 'Stable on current medication regimen.'
  },
  {
    name: 'Generalized Anxiety Disorder',
    icdCode: 'F41.1',
    category: 'Mental Health',
    status: 'Active - Managed',
    diagnosisDate: new Date('2016-01-01'),
    management: [
      'Medication (covered by antidepressants)',
      'CBT techniques',
      'Mindfulness'
    ],
    notes: 'Often flares with chronic illness management stress.'
  },
  {
    name: 'Attention-Deficit/Hyperactivity Disorder (ADHD)',
    icdCode: 'F90.2',
    category: 'Neurodevelopmental',
    status: 'Active - Managed',
    diagnosisDate: new Date('2018-06-01'),
    symptoms: [
      'Inattention',
      'Executive dysfunction',
      'Time blindness',
      'Difficulty with task initiation'
    ],
    management: [
      'Concerta 54mg every morning',
      'Organizational strategies',
      'Timer/reminder systems'
    ],
    notes: 'Good response to methylphenidate. Helps significantly with daily functioning.'
  },
  {
    name: 'Gender Dysphoria',
    icdCode: 'F64.0',
    category: 'Gender Identity',
    status: 'Active - In Care',
    notes: 'Under care of gender-affirming healthcare team.'
  },
  // Respiratory
  {
    name: 'Asthma',
    icdCode: 'J45.30',
    category: 'Respiratory',
    status: 'Active - Controlled',
    diagnosisDate: new Date('2010-01-01'),
    management: [
      'Symbicort 160-4.5mcg BID (controller)',
      'Albuterol PRN (rescue)',
      'Avoid triggers',
      'Annual flu vaccine'
    ],
    triggers: ['Cold air', 'Exercise', 'Allergens', 'Respiratory infections'],
    notes: 'Well-controlled on current regimen. Rarely needs rescue inhaler.'
  },
  {
    name: 'Obstructive Sleep Apnea',
    icdCode: 'G47.33',
    category: 'Sleep',
    status: 'Active - Needs Follow-up',
    diagnosisDate: new Date('2024-01-01'),
    management: [
      'Sleep study completed',
      'CPAP evaluation pending'
    ],
    notes: 'May contribute to fatigue and morning headaches.'
  },
  // Gastrointestinal
  {
    name: 'Gastroesophageal Reflux Disease (GERD)',
    icdCode: 'K21.0',
    category: 'Gastrointestinal',
    status: 'Active - Managed',
    management: [
      'Famotidine 40mg at bedtime',
      'Dietary modifications',
      'Elevate head of bed'
    ],
    notes: 'Common in EDS patients due to connective tissue laxity.'
  },
  {
    name: 'Chronic Constipation',
    icdCode: 'K59.00',
    category: 'Gastrointestinal',
    status: 'Active - Managed',
    management: [
      'Miralax 17g daily',
      'Adequate hydration',
      'Fiber intake',
      'Regular activity'
    ],
    notes: 'Related to autonomic dysfunction and medications.'
  },
  // Pain
  {
    name: 'Chronic Pain Syndrome',
    icdCode: 'G89.29',
    category: 'Pain',
    status: 'Active - Multimodal Management',
    management: [
      'Gabapentin 900mg daily',
      'Low-dose Naltrexone 4.5mg',
      'Meloxicam 15mg daily',
      'Cyclobenzaprine 5mg PRN',
      'Lidocaine patches PRN',
      'Physical therapy',
      'Heat/cold therapy',
      'Pacing strategies'
    ],
    notes: 'Multifactorial - EDS, inflammation, neuropathic components.'
  }
];

// ===== COMPLETE MEDICATIONS LIST =====
export const COMPLETE_MEDICATIONS = [
  // === PAIN MANAGEMENT ===
  {
    category: 'Pain Management',
    medications: [
      {
        name: 'Naltrexone (Low Dose/LDN)',
        genericName: 'naltrexone',
        strength: '4.5 mg',
        form: 'Capsule (compounded)',
        dosage: '1 capsule',
        frequency: 'Daily at bedtime',
        route: 'Oral',
        status: 'Active',
        startDate: new Date('2025-11-05'),
        prescriber: 'Dr. Fei A Cao',
        pharmacy: 'Compounding Pharmacy',
        purpose: 'Pain and inflammation modulation, immune regulation',
        instructions: 'Take at bedtime. May take 2-3 months for full effect.',
        sideEffects: ['Vivid dreams', 'Initial sleep changes'],
        interactions: ['Do not take with opioids - will cause withdrawal'],
        refillsRemaining: 5
      },
      {
        name: 'Meloxicam',
        strength: '15 mg',
        form: 'Tablet',
        dosage: '1 tablet',
        frequency: 'Daily with breakfast',
        route: 'Oral',
        status: 'Active',
        startDate: new Date('2025-11-05'),
        prescriber: 'Dr. Fei A Cao',
        purpose: 'Anti-inflammatory for joint pain',
        instructions: 'Take with food to reduce stomach upset. Stay hydrated.',
        sideEffects: ['GI upset', 'Increased bleeding risk'],
        interactions: ['Avoid other NSAIDs', 'Caution with blood thinners'],
        warnings: ['Allergic to Ketorolac - different NSAID class, but monitor']
      },
      {
        name: 'Gabapentin',
        strength: '300 mg',
        form: 'Capsule',
        dosage: '3 capsules (900mg total)',
        frequency: 'Daily - split doses',
        schedule: '300mg morning, 300mg afternoon, 300mg evening',
        route: 'Oral',
        status: 'Active',
        startDate: new Date('2025-08-20'),
        prescriber: 'Dr. Amanda Sommerville',
        purpose: 'Neuropathic pain, nerve pain from EDS',
        instructions: 'Can cause drowsiness. Do not stop abruptly - taper required.',
        sideEffects: ['Drowsiness', 'Dizziness', 'Weight gain'],
        interactions: ['Increased sedation with other CNS depressants']
      },
      {
        name: 'Cyclobenzaprine',
        strength: '5 mg',
        form: 'Tablet',
        dosage: '1 tablet',
        frequency: 'Up to 3 times daily AS NEEDED',
        route: 'Oral',
        status: 'Active',
        startDate: new Date('2025-11-05'),
        prescriber: 'Dr. Fei A Cao',
        purpose: 'Muscle relaxant for muscle spasms/pain',
        instructions: 'Use as needed for muscle pain. Causes significant drowsiness.',
        sideEffects: ['Drowsiness', 'Dry mouth', 'Dizziness'],
        maxDaily: '15mg (3 tablets)'
      },
      {
        name: 'Lidocaine Patch',
        genericName: 'Lidocaine 5%',
        strength: '5%',
        form: 'Topical patch',
        dosage: '1-3 patches',
        frequency: 'As needed - 12 hours on, 12 hours off',
        route: 'Topical',
        status: 'Active',
        startDate: new Date('2025-08-01'),
        prescriber: 'Pain Management',
        purpose: 'Localized pain relief',
        instructions: 'Apply to painful area. Maximum 3 patches at once. 12 hours on, 12 hours off.',
        sideEffects: ['Skin irritation at application site']
      }
    ]
  },
  // === AUTOIMMUNE/IMMUNOSUPPRESSANT ===
  {
    category: 'Autoimmune/Immunosuppressant',
    medications: [
      {
        name: 'Methotrexate',
        strength: '2.5 mg',
        form: 'Tablet',
        dosage: '6 tablets (15mg total)',
        frequency: 'Once weekly - MONDAY',
        route: 'Oral',
        status: 'Active',
        startDate: new Date('2025-10-20'),
        prescriber: 'Dr. Sarah Ifteqar',
        purpose: 'Disease-modifying treatment for RA',
        instructions: 'CRITICAL: Take on EMPTY STOMACH. NO folic acid on MTX day. Avoid alcohol completely. Report any signs of infection immediately.',
        warnings: [
          'Immunosuppressant - avoid sick contacts',
          'Requires regular blood monitoring (CBC, liver, kidney)',
          'Do NOT take if pregnant or planning pregnancy',
          'Avoid live vaccines'
        ],
        sideEffects: ['Nausea', 'Fatigue', 'Mouth sores', 'Hair thinning'],
        labMonitoring: 'CBC, CMP every 4-8 weeks'
      },
      {
        name: 'Folic Acid',
        strength: '1 mg',
        form: 'Tablet',
        dosage: '1 tablet',
        frequency: 'Daily EXCEPT Monday (MTX day)',
        route: 'Oral',
        status: 'Active',
        startDate: new Date('2025-05-13'),
        prescriber: 'Dr. Sarah Ifteqar',
        purpose: 'Reduces methotrexate side effects',
        instructions: 'SKIP on Methotrexate day (Monday). Take all other days.'
      }
    ]
  },
  // === MIGRAINE ===
  {
    category: 'Migraine Treatment',
    medications: [
      {
        name: 'Emgality',
        genericName: 'galcanezumab-gnlm',
        strength: '120 mg/mL',
        form: 'Prefilled pen/syringe',
        dosage: '1 injection',
        frequency: 'Every 4 weeks (monthly)',
        route: 'Subcutaneous injection',
        status: 'Active',
        startDate: new Date('2025-10-17'),
        prescriber: 'Dr. Parashar Koirala',
        purpose: 'Migraine prevention - CGRP inhibitor',
        instructions: 'Store in refrigerator. Remove 30 min before injection to warm. Inject in thigh, abdomen, or back of arm. Rotate sites.',
        sideEffects: ['Injection site reactions', 'Constipation'],
        specialtyPharmacy: true
      },
      {
        name: 'Topiramate',
        strength: '25 mg',
        form: 'Capsule',
        dosage: '2 capsules (50mg total)',
        frequency: 'Daily at bedtime',
        route: 'Oral',
        status: 'Active',
        startDate: new Date('2025-08-11'),
        purpose: 'Migraine prevention',
        instructions: 'Stay VERY well hydrated - risk of kidney stones. May affect cognition ("dopamax").',
        sideEffects: ['Cognitive slowing', 'Word-finding difficulty', 'Tingling', 'Weight loss', 'Kidney stone risk'],
        warnings: ['Increase fluid intake significantly', 'Avoid carbonated beverages']
      },
      {
        name: 'Sumatriptan',
        strength: '50 mg',
        form: 'Tablet',
        dosage: '1 tablet',
        frequency: 'As needed for migraine',
        route: 'Oral',
        status: 'Active',
        startDate: new Date('2025-10-17'),
        prescriber: 'Dr. Parashar Koirala',
        purpose: 'Acute migraine treatment - triptan',
        instructions: 'Take at FIRST sign of migraine for best effect. May repeat after 2 hours if needed. Maximum 200mg in 24 hours.',
        sideEffects: ['Chest tightness', 'Tingling', 'Drowsiness'],
        warnings: ['Do not use more than 10 days/month - risk of medication overuse headache'],
        maxDaily: '200mg'
      }
    ]
  },
  // === POTS/CARDIOVASCULAR ===
  {
    category: 'POTS/Cardiovascular',
    medications: [
      {
        name: 'Propranolol',
        strength: '20 mg',
        form: 'Tablet',
        dosage: '1 tablet',
        frequency: 'Twice daily',
        schedule: 'Morning and evening',
        route: 'Oral',
        status: 'Active',
        startDate: new Date('2025-08-27'),
        purpose: 'Heart rate control for POTS',
        instructions: 'Beta blocker - controls heart rate increases. Do not stop abruptly.',
        sideEffects: ['Fatigue', 'Cold extremities', 'Low blood pressure'],
        warnings: ['Do not stop suddenly - taper required', 'May mask low blood sugar symptoms']
      },
      {
        name: 'Midodrine',
        strength: '2.5 mg',
        form: 'Tablet',
        dosage: '1 tablet',
        frequency: '3 times daily',
        schedule: 'Morning, midday, afternoon (NO later than 4pm)',
        route: 'Oral',
        status: 'Active',
        startDate: new Date('2025-08-11'),
        purpose: 'Raises blood pressure for POTS',
        instructions: 'CRITICAL: Do NOT take within 4 hours of bedtime - causes supine hypertension. Take while upright/active.',
        sideEffects: ['Scalp tingling', 'Goosebumps', 'Urinary urgency'],
        warnings: ['Causes high blood pressure when lying down - last dose by 4pm']
      }
    ]
  },
  // === MENTAL HEALTH ===
  {
    category: 'Mental Health',
    medications: [
      {
        name: 'Duloxetine',
        genericName: 'Cymbalta',
        strength: '60 mg',
        form: 'Capsule',
        dosage: '1 capsule',
        frequency: 'Daily in morning',
        route: 'Oral',
        status: 'Active',
        startDate: new Date('2024-04-05'),
        prescriber: 'Dr. Amanda Sommerville',
        purpose: 'Depression, anxiety, and chronic pain (SNRI)',
        instructions: 'Take in morning. Do not stop abruptly - severe withdrawal.',
        sideEffects: ['Nausea (usually temporary)', 'Dry mouth', 'Constipation'],
        warnings: ['Taper required if discontinuing']
      },
      {
        name: 'Mirtazapine',
        genericName: 'Remeron',
        strength: '30 mg',
        form: 'Tablet',
        dosage: '1 tablet',
        frequency: 'Daily at bedtime',
        route: 'Oral',
        status: 'Active',
        startDate: new Date('2025-08-11'),
        purpose: 'Depression, anxiety, sleep, appetite',
        instructions: 'Take at bedtime - causes significant sedation. Helps with sleep and appetite.',
        sideEffects: ['Sedation', 'Increased appetite', 'Weight gain', 'Dry mouth']
      },
      {
        name: 'Concerta',
        genericName: 'Methylphenidate ER',
        strength: '54 mg',
        form: 'Extended-release tablet',
        dosage: '1 tablet',
        frequency: 'Every morning',
        route: 'Oral',
        status: 'Active',
        startDate: new Date('2025-08-11'),
        purpose: 'ADHD - attention, focus, executive function',
        instructions: 'Take in MORNING with or without food. Do NOT crush, chew, or split. Swallow whole.',
        sideEffects: ['Decreased appetite', 'Insomnia if taken late', 'Dry mouth'],
        warnings: ['Controlled substance - Schedule II', 'Do not take late in day'],
        controlledSubstance: true
      }
    ]
  },
  // === GASTROINTESTINAL ===
  {
    category: 'Gastrointestinal',
    medications: [
      {
        name: 'Famotidine',
        genericName: 'Pepcid',
        strength: '40 mg',
        form: 'Tablet',
        dosage: '1 tablet',
        frequency: 'At bedtime as needed',
        route: 'Oral',
        status: 'Active',
        startDate: new Date('2025-08-11'),
        prescriber: 'Dr. Amanda Sommerville',
        purpose: 'Acid reflux/GERD - H2 blocker',
        instructions: 'Take at bedtime for nighttime reflux. Can take as needed for breakthrough symptoms.'
      },
      {
        name: 'Miralax',
        genericName: 'Polyethylene Glycol 3350',
        strength: '17 gm',
        form: 'Powder',
        dosage: '1 capful (17g)',
        frequency: 'Daily',
        route: 'Oral',
        status: 'Active',
        startDate: new Date('2023-10-29'),
        prescriber: 'Dr. Allison Tigner',
        purpose: 'Chronic constipation management',
        instructions: 'Mix with 8oz water or other beverage. Stay well hydrated throughout day.',
        sideEffects: ['Bloating', 'Gas', 'Cramping initially']
      }
    ]
  },
  // === RESPIRATORY ===
  {
    category: 'Respiratory',
    medications: [
      {
        name: 'Symbicort',
        genericName: 'Budesonide-Formoterol',
        strength: '160-4.5 mcg',
        form: 'Inhaler',
        dosage: '2 puffs',
        frequency: 'Twice daily',
        schedule: 'Morning and evening',
        route: 'Inhalation',
        status: 'Active',
        startDate: new Date('2024-09-03'),
        prescriber: 'Dr. Amanda Sommerville',
        purpose: 'Asthma controller - corticosteroid + LABA',
        instructions: 'CRITICAL: Rinse mouth and gargle after EVERY use to prevent thrush. This is a CONTROLLER, not rescue.',
        sideEffects: ['Oral thrush if not rinsing', 'Hoarseness'],
        warnings: ['Must rinse mouth after use', 'Not for acute attacks']
      },
      {
        name: 'Albuterol',
        genericName: 'ProAir HFA',
        strength: '90 mcg/actuation',
        form: 'Inhaler',
        dosage: '1-2 puffs',
        frequency: 'As needed',
        route: 'Inhalation',
        status: 'Active',
        startDate: new Date('2024-09-03'),
        prescriber: 'Dr. Amanda Sommerville',
        purpose: 'RESCUE INHALER - acute breathing difficulty',
        instructions: 'RESCUE INHALER - Keep accessible at ALL times. Use for breathing difficulty, wheezing, before exercise if needed.',
        sideEffects: ['Tremor', 'Rapid heartbeat', 'Nervousness'],
        warnings: ['If using more than 2x/week, asthma may not be controlled - contact provider']
      }
    ]
  },
  // === PREVENTION/ANTIVIRAL ===
  {
    category: 'Prevention',
    medications: [
      {
        name: 'Truvada',
        genericName: 'Emtricitabine/Tenofovir disoproxil fumarate',
        strength: '200-300 mg',
        form: 'Tablet',
        dosage: '1 tablet',
        frequency: 'Daily',
        route: 'Oral',
        status: 'Active',
        startDate: new Date('2025-10-07'),
        prescriber: 'Dr. Amanda Sommerville',
        purpose: 'PrEP - HIV prevention',
        instructions: 'Take consistently EVERY day for effectiveness. Requires regular lab monitoring (kidney function, HIV test every 3 months).',
        sideEffects: ['Nausea (usually resolves)', 'Headache initially'],
        labMonitoring: 'Kidney function, HIV test every 3 months'
      }
    ]
  },
  // === SUPPLEMENTS ===
  {
    category: 'Supplements',
    medications: [
      {
        name: 'Vitamin D3-50',
        genericName: 'Cholecalciferol',
        strength: '50,000 IU',
        form: 'Capsule',
        dosage: '1 capsule',
        frequency: 'Once weekly',
        route: 'Oral',
        status: 'Active',
        startDate: new Date('2025-08-11'),
        prescriber: 'Dr. Amanda Sommerville',
        purpose: 'Vitamin D deficiency treatment',
        instructions: 'Take with fatty meal for better absorption. High dose - prescription strength.',
        labMonitoring: 'Vitamin D levels periodically'
      }
    ]
  }
];

// ===== MEDICAL EQUIPMENT =====
export const MEDICAL_EQUIPMENT = [
  {
    name: 'Thigh-High Compression Stockings',
    type: 'Compression Garment',
    compression: '20-30 mmHg',
    purpose: 'POTS management - prevents blood pooling in legs',
    prescriber: 'Dr. Amanda Sommerville',
    startDate: new Date('2024-11-26'),
    instructions: 'Wear during daytime when upright/active. Remove at night.',
    tips: ['Put on before getting out of bed', 'Use donning gloves if needed', 'Replace every 3-6 months']
  },
  {
    name: 'Hinge Lateral J Knee Brace',
    type: 'Joint Support',
    side: 'As needed',
    purpose: 'EDS knee support - prevents hyperextension and subluxation',
    prescriber: 'Dr. Amanda Sommerville',
    startDate: new Date('2022-11-29'),
    instructions: 'Wear during activities for joint support and stability.',
    tips: ['Adjust straps for comfort', 'Check skin for irritation', 'Use during high-risk activities']
  },
  {
    name: 'Wrist Splints',
    type: 'Joint Support',
    purpose: 'EDS wrist support - prevents hyperextension',
    instructions: 'Wear during activities that stress wrists or at night if needed.'
  },
  {
    name: 'Ring Splints',
    type: 'Joint Support',
    purpose: 'EDS finger support - prevents finger hyperextension',
    instructions: 'Wear on hypermobile fingers during fine motor activities.'
  }
];

// ===== HEALTHCARE PROVIDERS =====
export const HEALTHCARE_PROVIDERS = [
  {
    name: 'Dr. Amanda Sommerville',
    role: 'Primary Care Physician',
    specialty: 'Internal Medicine',
    clinic: 'University Health',
    address: '2301 Holmes Street, Kansas City, MO 64108',
    phone: '816-404-5000',
    isPrimary: true,
    manages: ['Overall care coordination', 'PrEP', 'Asthma', 'General health']
  },
  {
    name: 'Dr. Sarah Ifteqar',
    role: 'Rheumatologist',
    specialty: 'Rheumatology',
    clinic: 'University Health Rheumatology',
    manages: ['Seronegative RA', 'Methotrexate management', 'Joint inflammation']
  },
  {
    name: 'Dr. Parashar Koirala',
    role: 'Neurologist',
    specialty: 'Neurology - Headache',
    manages: ['Chronic migraines', 'Migraine prevention', 'Emgality']
  },
  {
    name: 'Dr. Fei A Cao',
    role: 'Pain Management',
    specialty: 'Pain Medicine',
    manages: ['Chronic pain', 'LDN', 'Pain medications']
  },
  {
    name: 'Dr. Allison Tigner',
    role: 'Gastroenterologist',
    specialty: 'Gastroenterology',
    manages: ['GI issues', 'Constipation', 'GERD']
  }
];

// ===== SURGICAL HISTORY =====
export const SURGICAL_HISTORY = [
  {
    procedure: 'Total Laparoscopic Hysterectomy',
    date: new Date('2023-10-26'),
    facility: "Saint Luke's Hospital",
    surgeon: 'Dr. OB/GYN',
    reason: 'Gender-affirming care / Medical necessity',
    notes: 'Successful, uncomplicated recovery'
  },
  {
    procedure: 'Colonoscopy',
    date: new Date('2023-10-15'),
    facility: 'University Health',
    reason: 'Diagnostic - GI symptoms',
    findings: 'Normal'
  },
  {
    procedure: 'EGD (Esophagogastroduodenoscopy)',
    date: new Date('2023-10-15'),
    facility: 'University Health',
    reason: 'Diagnostic - GERD evaluation',
    findings: 'Mild esophagitis'
  }
];

// ===== LAB RESULTS (Recent) =====
export const RECENT_LAB_RESULTS = [
  {
    testName: 'Complete Blood Count (CBC)',
    date: new Date('2025-11-01'),
    results: {
      'WBC': { value: 6.2, unit: 'K/uL', range: '4.5-11.0', status: 'Normal' },
      'RBC': { value: 4.5, unit: 'M/uL', range: '4.0-5.5', status: 'Normal' },
      'Hemoglobin': { value: 13.8, unit: 'g/dL', range: '12.0-16.0', status: 'Normal' },
      'Hematocrit': { value: 41, unit: '%', range: '36-46', status: 'Normal' },
      'Platelets': { value: 245, unit: 'K/uL', range: '150-400', status: 'Normal' }
    },
    orderedBy: 'Dr. Sarah Ifteqar',
    reason: 'Methotrexate monitoring'
  },
  {
    testName: 'Comprehensive Metabolic Panel (CMP)',
    date: new Date('2025-11-01'),
    results: {
      'Glucose': { value: 92, unit: 'mg/dL', range: '70-100', status: 'Normal' },
      'Creatinine': { value: 0.9, unit: 'mg/dL', range: '0.6-1.2', status: 'Normal' },
      'BUN': { value: 15, unit: 'mg/dL', range: '7-20', status: 'Normal' },
      'AST': { value: 22, unit: 'U/L', range: '10-40', status: 'Normal' },
      'ALT': { value: 18, unit: 'U/L', range: '7-56', status: 'Normal' }
    },
    orderedBy: 'Dr. Sarah Ifteqar',
    reason: 'Methotrexate monitoring - liver/kidney function'
  },
  {
    testName: 'Vitamin D, 25-Hydroxy',
    date: new Date('2025-10-15'),
    results: {
      'Vitamin D': { value: 38, unit: 'ng/mL', range: '30-100', status: 'Normal' }
    },
    notes: 'Improved from previous deficiency with supplementation'
  }
];

// ===== IMMUNIZATIONS =====
export const IMMUNIZATIONS = [
  { vaccine: 'COVID-19 (Pfizer)', date: new Date('2024-10-01'), notes: 'Bivalent booster' },
  { vaccine: 'Influenza', date: new Date('2025-10-15'), notes: 'Annual flu shot' },
  { vaccine: 'Tdap', date: new Date('2022-01-15'), notes: 'Every 10 years' },
  { vaccine: 'Hepatitis B', series: 'Complete', notes: 'Required for PrEP' },
  { vaccine: 'HPV (Gardasil 9)', series: 'Complete' }
];

// ===== SPOON THEORY TRACKING =====
export const SPOON_THEORY_CONFIG = {
  maxSpoons: 12,
  activities: [
    { name: 'Getting out of bed', spoons: 1 },
    { name: 'Showering', spoons: 2 },
    { name: 'Getting dressed', spoons: 1 },
    { name: 'Preparing meal', spoons: 2 },
    { name: 'Eating meal', spoons: 1 },
    { name: 'Light housework', spoons: 2 },
    { name: 'Heavy housework', spoons: 3 },
    { name: 'Going to appointment', spoons: 3 },
    { name: 'Social activity', spoons: 2-4 },
    { name: 'Work/Study (per hour)', spoons: 1 },
    { name: 'Exercise (light)', spoons: 2 },
    { name: 'Exercise (moderate)', spoons: 4 },
    { name: 'Driving', spoons: 2 },
    { name: 'Running errands', spoons: 3 }
  ],
  flareAdjustment: -4, // Reduce max spoons during flare
  recoveryBonus: 2 // Extra spoons after good rest
};

// ===== EMERGENCY INFORMATION =====
export const EMERGENCY_INFO = {
  conditions: ['EDS', 'POTS', 'Asthma', 'On immunosuppressant (MTX)'],
  allergies: ['Ketorolac', 'Latex', 'Oranges (migraine trigger)'],
  bloodType: 'A Positive',
  emergencyContact: {
    name: 'Mary Jones',
    relationship: 'Mother',
    phone: '913-638-8640'
  },
  instructions: [
    'Has POTS - may need IV fluids, keep legs elevated',
    'Has EDS - joints are hypermobile, be careful with positioning',
    'On Methotrexate - immunosuppressed, watch for infection signs',
    'Latex allergy - use non-latex gloves and equipment',
    'Rescue inhaler in bag for asthma'
  ],
  doNotUse: ['Ketorolac (Toradol)', 'Latex products']
};

// Helper function to get medication by name
export function getMedicationByName(name: string) {
  for (const category of COMPLETE_MEDICATIONS) {
    const med = category.medications.find(
      m => m.name.toLowerCase().includes(name.toLowerCase()) ||
           (m.genericName && m.genericName.toLowerCase().includes(name.toLowerCase()))
    );
    if (med) return { ...med, category: category.category };
  }
  return null;
}

// Helper function to get all active medications flat list
export function getAllActiveMedications() {
  const allMeds: any[] = [];
  for (const category of COMPLETE_MEDICATIONS) {
    for (const med of category.medications) {
      if (med.status === 'Active') {
        allMeds.push({ ...med, category: category.category });
      }
    }
  }
  return allMeds;
}

// Helper function to get medications by category
export function getMedicationsByCategory(categoryName: string) {
  const category = COMPLETE_MEDICATIONS.find(c => c.category === categoryName);
  return category ? category.medications : [];
}

// Helper function to get condition by name
export function getConditionByName(name: string) {
  return HEALTH_CONDITIONS.find(
    c => c.name.toLowerCase().includes(name.toLowerCase())
  );
}
