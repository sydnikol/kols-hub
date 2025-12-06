/**
 * SYDNEY JONES - REAL MEDICATIONS
 * ================================
 * Source: myUHealth - University Health Portal
 * Last Updated: November 2025
 *
 * These are Sydney's actual prescribed medications.
 * DO NOT add fake/example medications to this file.
 */

export interface Medication {
  drugName: string;         // Name of the medication
  genericName?: string;     // Generic name if different
  strength: string;         // Dose strength (e.g., "5mg", "0.1mg")
  dosage: string;           // Amount taken (e.g., "1 tablet", "2 capsules")
  frequency: string;        // How often (e.g., "3 times daily", "Twice daily")
  status: 'Active' | 'Inactive';  // Current status
  startDate: Date;          // When started taking it
  endDate?: Date;           // When stopped (if applicable)
  prescriber?: string;      // Doctor who prescribed it
  notes?: string;           // Additional notes about the medication
  nextDose?: Date;          // When next dose is due (for scheduling)
  category?: string;        // Category for grouping
}

/**
 * SYDNEY'S MEDICATIONS - From myUHealth Nov 2025
 */
export const MY_MEDICATIONS: Medication[] = [
  // Pain/Inflammation Management
  {
    drugName: 'Naltrexone (Low Dose)',
    genericName: 'naltrexone compounding powder',
    strength: '4.5 mg',
    dosage: '1 capsule',
    frequency: 'Daily',
    status: 'Active',
    startDate: new Date('2025-11-05'),
    prescriber: 'Dr. Fei A Cao',
    notes: 'LDN therapy for pain and inflammation management',
    category: 'Pain Management'
  },
  {
    drugName: 'Meloxicam',
    strength: '15 mg',
    dosage: '1 tablet',
    frequency: 'Daily',
    status: 'Active',
    startDate: new Date('2025-11-05'),
    prescriber: 'Dr. Fei A Cao',
    notes: 'NSAID - Take with food to reduce stomach upset',
    category: 'Pain Management'
  },
  {
    drugName: 'Cyclobenzaprine',
    strength: '5 mg',
    dosage: '1 tablet',
    frequency: '3 times daily as needed',
    status: 'Active',
    startDate: new Date('2025-11-05'),
    prescriber: 'Dr. Fei A Cao',
    notes: 'Muscle relaxant - AS NEEDED FOR MUSCLE PAIN. May cause drowsiness.',
    category: 'Muscle Relaxant'
  },
  {
    drugName: 'Gabapentin',
    strength: '300 mg',
    dosage: '3 capsules daily',
    frequency: 'Daily (900mg total)',
    status: 'Active',
    startDate: new Date('2025-08-20'),
    prescriber: 'Dr. Amanda Sommerville',
    notes: 'For neuropathic pain and nerve pain - EDS',
    category: 'Pain Management'
  },
  {
    drugName: 'Duloxetine',
    genericName: 'Cymbalta',
    strength: '60 mg',
    dosage: '1 capsule',
    frequency: 'Daily',
    status: 'Active',
    startDate: new Date('2024-04-05'),
    prescriber: 'Dr. Amanda Sommerville',
    notes: 'SNRI for mood and chronic pain management',
    category: 'Antidepressant/Pain'
  },

  // Autoimmune/Anti-inflammatory
  {
    drugName: 'Methotrexate',
    strength: '2.5 mg',
    dosage: '6 tablets (15mg total)',
    frequency: 'Once weekly (Monday)',
    status: 'Active',
    startDate: new Date('2025-10-20'),
    prescriber: 'Dr. Sarah Ifteqar',
    notes: 'CRITICAL: Take on empty stomach. NO folic acid on MTX day. Avoid alcohol. Monitor for signs of infection.',
    category: 'Immunosuppressant'
  },
  {
    drugName: 'Folic Acid',
    strength: '1 mg',
    dosage: '1 tablet',
    frequency: 'Daily (EXCEPT MTX day)',
    status: 'Active',
    startDate: new Date('2025-05-13'),
    prescriber: 'Dr. Sarah Ifteqar',
    notes: 'Supports methotrexate therapy - SKIP on Methotrexate day',
    category: 'Supplement'
  },

  // Migraine Treatment
  {
    drugName: 'Sumatriptan',
    strength: '50 mg',
    dosage: '1 tablet',
    frequency: 'As needed for migraine',
    status: 'Active',
    startDate: new Date('2025-10-17'),
    prescriber: 'Dr. Parashar Koirala',
    notes: 'Take at first sign of migraine. May repeat after 2 hours if needed (max 200mg/day).',
    category: 'Migraine Treatment'
  },
  {
    drugName: 'Emgality',
    genericName: 'galcanezumab',
    strength: '120 mg',
    dosage: '1 injection',
    frequency: 'Every 4 weeks',
    status: 'Active',
    startDate: new Date('2025-10-17'),
    prescriber: 'Dr. Parashar Koirala',
    notes: 'Monthly injection for migraine prevention. Store in refrigerator. Let warm to room temp before injecting.',
    category: 'Migraine Prevention'
  },
  {
    drugName: 'Topiramate',
    strength: '25 mg',
    dosage: '2 capsules (50mg total)',
    frequency: 'Daily',
    status: 'Active',
    startDate: new Date('2025-08-11'),
    notes: 'For migraine prevention. Stay well hydrated. May cause cognitive effects.',
    category: 'Migraine Prevention'
  },

  // POTS Management
  {
    drugName: 'Propranolol',
    strength: '20 mg',
    dosage: '1 tablet',
    frequency: 'Twice daily',
    status: 'Active',
    startDate: new Date('2025-08-27'),
    notes: 'Beta blocker for POTS symptoms and heart rate control',
    category: 'POTS/Cardiovascular'
  },
  {
    drugName: 'Midodrine',
    strength: '2.5 mg',
    dosage: '1 tablet',
    frequency: '3 times daily',
    status: 'Active',
    startDate: new Date('2025-08-11'),
    notes: 'Raises blood pressure. DO NOT take within 4 hours of bedtime.',
    category: 'POTS/Cardiovascular'
  },

  // ADHD
  {
    drugName: 'Concerta',
    genericName: 'Methylphenidate ER',
    strength: '54 mg',
    dosage: '1 tablet',
    frequency: 'Every morning',
    status: 'Active',
    startDate: new Date('2025-08-11'),
    notes: 'Extended release ADHD medication. Take in morning. Do not crush or chew.',
    category: 'ADHD/Stimulant'
  },

  // Sleep & Mental Health
  {
    drugName: 'Mirtazapine',
    strength: '30 mg',
    dosage: '1 tablet',
    frequency: 'Daily at bedtime',
    status: 'Active',
    startDate: new Date('2025-08-11'),
    notes: 'For sleep and mood. Take at bedtime - causes sedation.',
    category: 'Antidepressant'
  },

  // GI/Digestive
  {
    drugName: 'Famotidine',
    genericName: 'Pepcid',
    strength: '40 mg',
    dosage: '1 tablet',
    frequency: 'At bedtime as needed',
    status: 'Active',
    startDate: new Date('2025-08-11'),
    prescriber: 'Dr. Amanda Sommerville',
    notes: 'H2 blocker for acid reflux/GERD',
    category: 'Gastrointestinal'
  },
  {
    drugName: 'Miralax',
    genericName: 'Polyethylene Glycol 3350',
    strength: '17 gm',
    dosage: '1 dose',
    frequency: 'Daily',
    status: 'Active',
    startDate: new Date('2023-10-29'),
    prescriber: 'Dr. Allison Tigner',
    notes: 'Mix with water or other beverage. Stay well hydrated.',
    category: 'Gastrointestinal'
  },

  // Respiratory
  {
    drugName: 'Budesonide-Formoterol',
    genericName: 'Symbicort',
    strength: '160-4.5 mcg',
    dosage: '2 puffs',
    frequency: 'Twice daily',
    status: 'Active',
    startDate: new Date('2024-09-03'),
    prescriber: 'Dr. Amanda Sommerville',
    notes: 'CRITICAL: Rinse mouth after use to prevent thrush. This is a controller, not rescue inhaler.',
    category: 'Respiratory'
  },
  {
    drugName: 'Albuterol',
    genericName: 'ProAir HFA',
    strength: '90 mcg',
    dosage: '1-2 puffs',
    frequency: 'As needed',
    status: 'Active',
    startDate: new Date('2024-09-03'),
    prescriber: 'Dr. Amanda Sommerville',
    notes: 'RESCUE INHALER - Keep accessible at all times. Use for breathing difficulty.',
    category: 'Respiratory'
  },

  // Prevention
  {
    drugName: 'Truvada',
    genericName: 'Emtricitabine/Tenofovir',
    strength: '200-300 mg',
    dosage: '1 tablet',
    frequency: 'Daily',
    status: 'Active',
    startDate: new Date('2025-10-07'),
    prescriber: 'Dr. Amanda Sommerville',
    notes: 'PrEP - Take consistently every day for effectiveness. Regular lab monitoring required.',
    category: 'Antiviral/Prevention'
  },

  // Supplements
  {
    drugName: 'Vitamin D3-50',
    genericName: 'Cholecalciferol',
    strength: '50,000 IU',
    dosage: '1 capsule',
    frequency: 'Once weekly',
    status: 'Active',
    startDate: new Date('2025-08-11'),
    prescriber: 'Dr. Amanda Sommerville',
    notes: 'High dose weekly supplement. Take with fatty meal for better absorption.',
    category: 'Supplement'
  }
];

/**
 * SYDNEY'S MEDICAL EQUIPMENT
 */
export const MY_MEDICAL_EQUIPMENT = [
  {
    name: 'Thigh High Compression Stockings',
    purpose: 'POTS management - prevents blood pooling',
    prescriber: 'Dr. Amanda Sommerville',
    startDate: new Date('2024-11-26'),
    notes: 'Wear during day when upright'
  },
  {
    name: 'Hinge Lateral J Knee Brace',
    purpose: 'EDS knee support and stability',
    prescriber: 'Dr. Amanda Sommerville',
    startDate: new Date('2022-11-29'),
    notes: 'Wear during activities for joint support'
  }
];

/**
 * SYDNEY'S HEALTH CONDITIONS
 */
export const MY_HEALTH_CONDITIONS = [
  {
    name: 'Ehlers-Danlos Syndrome Type 3 (hEDS)',
    icdCode: 'M35.7',
    status: 'Active',
    diagnosisDate: new Date('2022-07-25'),
    notes: 'Hypermobile type - Joint hypermobility, easy bruising, slow wound healing'
  },
  {
    name: 'Postural Orthostatic Tachycardia Syndrome (POTS)',
    icdCode: 'G90.A',
    status: 'Active',
    diagnosisDate: new Date('2023-07-25'),
    notes: 'Managed with midodrine, propranolol, compression stockings, increased salt/fluids'
  },
  {
    name: 'Chronic Pain Syndrome',
    status: 'Active',
    notes: 'Related to EDS, managed with multimodal approach'
  },
  {
    name: 'Chronic Migraine',
    status: 'Active',
    notes: 'Managed with Emgality, Topiramate, Sumatriptan PRN'
  },
  {
    name: 'ADHD',
    status: 'Active',
    notes: 'Managed with Concerta'
  },
  {
    name: 'Asthma',
    status: 'Active',
    notes: 'Controlled with Symbicort, Albuterol rescue inhaler'
  }
];

/**
 * SYDNEY'S VITAL STATS
 */
export const MY_VITAL_STATS = {
  bloodType: 'A Positive',
  weight: 160.50, // lbs
  height: "5'5\"",
  bmi: 26.7,
  lastUpdated: '2025-10-17'
};
