/**
 * 🖤 CENTRALIZED MEDICATION DATA
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Single source of truth for all medications
 *
 * 📝 TO ADD A NEW MEDICATION:
 * 1. Copy an existing medication entry below
 * 2. Update the drugName, strength, dosage, frequency, etc.
 * 3. Save this file
 * 4. Clear your app data OR delete the 'profileInitialized' preference
 * 5. Reload the app to re-initialize with new medications
 *
 * 📝 TO EDIT AN EXISTING MEDICATION:
 * 1. Find the medication in MY_MEDICATIONS array below
 * 2. Update any fields (strength, frequency, prescriber, notes, etc.)
 * 3. Save this file
 * 4. The changes will be reflected after clearing app data and reloading
 *
 * 📝 TO REMOVE A MEDICATION:
 * 1. Find the medication entry below
 * 2. Delete the entire { ... } block (including the comma)
 * 3. Save this file
 *
 * 💡 OPTIONAL FIELDS: genericName, endDate, prescriber, notes, nextDose
 * 🔴 REQUIRED FIELDS: drugName, strength, dosage, frequency, status, startDate
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

export interface Medication {
  drugName: string;         // Name of the medication (e.g., "Midodrine")
  genericName?: string;     // Generic name if different (e.g., "Midodrine HCl")
  strength: string;         // Dose strength (e.g., "5mg", "0.1mg")
  dosage: string;           // Amount taken (e.g., "1 tablet", "2 capsules")
  frequency: string;        // How often (e.g., "3 times daily", "Twice daily")
  status: 'Active' | 'Inactive';  // Current status
  startDate: Date;          // When you started taking it
  endDate?: Date;           // When you stopped (if applicable)
  prescriber?: string;      // Doctor who prescribed it (e.g., "Dr. Cardiologist")
  notes?: string;           // Additional notes about the medication
  nextDose?: Date;          // When next dose is due (for scheduling)
}

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * YOUR MEDICATIONS - Edit this list to manage your meds
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */
export const MY_MEDICATIONS: Medication[] = [
  // POTS Medications
  {
    drugName: 'Midodrine',
    genericName: 'Midodrine HCl',
    strength: '5mg',
    dosage: '1 tablet',
    frequency: '3 times daily',
    status: 'Active',
    startDate: new Date('2024-01-01'),
    prescriber: 'Dr. Cardiologist',
    notes: 'For POTS - helps raise blood pressure',
    nextDose: new Date(Date.now() + 7200000) // 2 hours from now
  },
  {
    drugName: 'Fludrocortisone',
    genericName: 'Fludrocortisone Acetate',
    strength: '0.1mg',
    dosage: '1 tablet',
    frequency: 'Daily in morning',
    status: 'Active',
    startDate: new Date('2024-01-01'),
    prescriber: 'Dr. Cardiologist',
    notes: 'Helps retain sodium and fluids for POTS'
  },
  {
    drugName: 'Propranolol',
    genericName: 'Propranolol HCl',
    strength: '10mg',
    dosage: '1 tablet',
    frequency: 'Twice daily',
    status: 'Active',
    startDate: new Date('2024-01-01'),
    prescriber: 'Dr. Cardiologist',
    notes: 'Beta blocker for heart rate control in POTS'
  },

  // MCAS/Antihistamine Protocol
  {
    drugName: 'Cetirizine (H1)',
    genericName: 'Cetirizine HCl',
    strength: '10mg',
    dosage: '1 tablet',
    frequency: 'Twice daily',
    status: 'Active',
    startDate: new Date('2024-02-01'),
    prescriber: 'Dr. Allergist',
    notes: 'H1 antihistamine for MCAS symptoms'
  },
  {
    drugName: 'Famotidine (H2)',
    genericName: 'Famotidine',
    strength: '20mg',
    dosage: '1 tablet',
    frequency: 'Twice daily',
    status: 'Active',
    startDate: new Date('2024-02-01'),
    prescriber: 'Dr. Allergist',
    notes: 'H2 antihistamine for MCAS and GI symptoms'
  },
  {
    drugName: 'Quercetin',
    strength: '500mg',
    dosage: '1 capsule',
    frequency: 'Twice daily with meals',
    status: 'Active',
    startDate: new Date('2024-03-01'),
    notes: 'Natural mast cell stabilizer'
  },
  {
    drugName: 'Cromolyn Sodium',
    genericName: 'Cromolyn Sodium',
    strength: '200mg/5mL',
    dosage: '1 ampule',
    frequency: '4 times daily before meals',
    status: 'Active',
    startDate: new Date('2024-04-01'),
    prescriber: 'Dr. Allergist',
    notes: 'Mast cell stabilizer for GI MCAS symptoms'
  },

  // Pain Management
  {
    drugName: 'Gabapentin',
    genericName: 'Gabapentin',
    strength: '300mg',
    dosage: '1 capsule',
    frequency: '3 times daily',
    status: 'Active',
    startDate: new Date('2023-11-01'),
    prescriber: 'Dr. Pain Management',
    notes: 'For neuropathic pain and nerve pain'
  },
  {
    drugName: 'Cyclobenzaprine',
    genericName: 'Cyclobenzaprine HCl',
    strength: '5mg',
    dosage: '1 tablet',
    frequency: 'At bedtime as needed',
    status: 'Active',
    startDate: new Date('2024-01-01'),
    prescriber: 'Dr. Pain Management',
    notes: 'Muscle relaxer for muscle spasms and tension'
  },
  {
    drugName: 'Tramadol',
    genericName: 'Tramadol HCl',
    strength: '50mg',
    dosage: '1 tablet',
    frequency: 'Every 6 hours as needed',
    status: 'Active',
    startDate: new Date('2023-10-01'),
    prescriber: 'Dr. Pain Management',
    notes: 'For moderate pain management'
  },
  {
    drugName: 'Lidocaine Patches',
    genericName: 'Lidocaine 5%',
    strength: '5%',
    dosage: '1 patch',
    frequency: 'Up to 3 patches daily for 12 hours',
    status: 'Active',
    startDate: new Date('2024-02-01'),
    prescriber: 'Dr. Pain Management',
    notes: 'Topical pain relief for localized pain'
  },

  // GI/Digestive Support
  {
    drugName: 'Omeprazole',
    genericName: 'Omeprazole',
    strength: '20mg',
    dosage: '1 capsule',
    frequency: 'Daily before breakfast',
    status: 'Active',
    startDate: new Date('2024-01-01'),
    prescriber: 'Dr. Gastroenterologist',
    notes: 'For acid reflux and GERD'
  },
  {
    drugName: 'Ondansetron',
    genericName: 'Ondansetron HCl',
    strength: '4mg',
    dosage: '1 tablet',
    frequency: 'As needed for nausea',
    status: 'Active',
    startDate: new Date('2024-01-01'),
    prescriber: 'Dr. Gastroenterologist',
    notes: 'Anti-nausea medication'
  },

  // Vitamins & Supplements
  {
    drugName: 'Vitamin D3',
    genericName: 'Cholecalciferol',
    strength: '5000 IU',
    dosage: '1 capsule',
    frequency: 'Daily with food',
    status: 'Active',
    startDate: new Date('2024-01-01'),
    notes: 'For deficiency common in chronic illness'
  },
  {
    drugName: 'Vitamin B12',
    genericName: 'Methylcobalamin',
    strength: '1000 mcg',
    dosage: '1 sublingual tablet',
    frequency: 'Daily',
    status: 'Active',
    startDate: new Date('2024-01-01'),
    notes: 'For energy and nerve function'
  },
  {
    drugName: 'Magnesium Glycinate',
    strength: '400mg',
    dosage: '1 capsule',
    frequency: 'Daily at bedtime',
    status: 'Active',
    startDate: new Date('2024-01-01'),
    notes: 'Helps with sleep and muscle cramping'
  },
  {
    drugName: 'CoQ10',
    genericName: 'Coenzyme Q10',
    strength: '200mg',
    dosage: '1 capsule',
    frequency: 'Daily with food',
    status: 'Active',
    startDate: new Date('2024-02-01'),
    notes: 'For mitochondrial support and energy'
  },
  {
    drugName: 'Vitamin C',
    genericName: 'Ascorbic Acid',
    strength: '1000mg',
    dosage: '1 tablet',
    frequency: 'Daily',
    status: 'Active',
    startDate: new Date('2024-01-01'),
    notes: 'Antioxidant and immune support'
  },
  {
    drugName: 'Iron Supplement',
    genericName: 'Ferrous Sulfate',
    strength: '325mg',
    dosage: '1 tablet',
    frequency: 'Daily with vitamin C',
    status: 'Active',
    startDate: new Date('2024-03-01'),
    notes: 'For iron deficiency anemia'
  },
  {
    drugName: 'Zinc',
    genericName: 'Zinc Gluconate',
    strength: '50mg',
    dosage: '1 tablet',
    frequency: 'Daily with food',
    status: 'Active',
    startDate: new Date('2024-02-01'),
    notes: 'Immune support and wound healing for EDS'
  },

  // Sleep & Mental Health
  {
    drugName: 'Melatonin',
    strength: '5mg',
    dosage: '1 tablet',
    frequency: 'At bedtime',
    status: 'Active',
    startDate: new Date('2024-01-01'),
    notes: 'For sleep regulation'
  },
  {
    drugName: 'Hydroxyzine',
    genericName: 'Hydroxyzine Pamoate',
    strength: '25mg',
    dosage: '1 capsule',
    frequency: 'At bedtime or as needed for anxiety',
    status: 'Active',
    startDate: new Date('2024-01-01'),
    prescriber: 'Dr. Psychiatrist',
    notes: 'For anxiety and as additional antihistamine'
  },

  // Additional Support
  {
    drugName: 'Electrolyte Packets',
    strength: 'Varies',
    dosage: '1-3 packets',
    frequency: 'Daily in water',
    status: 'Active',
    startDate: new Date('2024-01-01'),
    notes: 'Sodium and electrolyte supplementation for POTS'
  }
];
