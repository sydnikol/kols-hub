import * as XLSX from 'xlsx';
import { Medication } from '../types/medication';

export interface ImportedMedication {
  name: string;
  dose: string;
  frequency: string;
  route: string;
  prescriber?: string;
  dateStarted?: string;
  instructions?: string;
}

// Parse PDF text (from myUHealth portal format)
export const parsePDFMedicationList = (pdfText: string): ImportedMedication[] => {
  const medications: ImportedMedication[] = [];
  
  // Split by medication entries (looking for "Learn more about this" as separator)
  const entries = pdfText.split('Learn more about this');
  
  for (const entry of entries) {
    if (!entry.trim()) continue;
    
    const med: Partial<ImportedMedication> = {};
    
    // Extract medication name (first line before "Learn more")
    const nameMatch = entry.match(/([a-zA-Z0-9\s\-]+(?:mg|mcg|mL)?(?:\s+oral|\s+subcutaneous|\s+inhalation)?(?:\s+tablet|\s+capsule|\s+solution|\s+aerosol|\s+powder)?)/i);
    if (nameMatch) {
      med.name = nameMatch[1].trim();
    }
    
    // Extract Date Started On
    const dateMatch = entry.match(/Date Started On:\s*([A-Za-z]{3}\s+\d{1,2},\s+\d{4})/);
    if (dateMatch) {
      med.dateStarted = dateMatch[1];
    }
    
    // Extract Ordered By (Prescriber)
    const prescriberMatch = entry.match(/Ordered By:\s*([^,]+,\s*[A-Z]+,\s*[A-Za-z\s]+)/);
    if (prescriberMatch) {
      med.prescriber = prescriberMatch[1].trim();
    }
    
    // Extract Dose
    const doseMatch = entry.match(/Dose:\s*([^\n]+)/);
    if (doseMatch) {
      med.dose = doseMatch[1].trim();
    }
    
    // Extract Frequency
    const frequencyMatch = entry.match(/Frequency:\s*([^\n]+)/);
    if (frequencyMatch) {
      med.frequency = frequencyMatch[1].trim();
    }
    
    // Extract Route
    const routeMatch = entry.match(/Route:\s*([^\n]+)/);
    if (routeMatch) {
      med.route = routeMatch[1].trim();
    }
    
    // Extract Instructions
    const instructionsMatch = entry.match(/Instructions:\s*([^\n]+)/);
    if (instructionsMatch) {
      med.instructions = instructionsMatch[1].trim();
    }
    
    // Only add if we have at least name and dose
    if (med.name && med.dose) {
      medications.push(med as ImportedMedication);
    }
  }
  
  return medications;
};

// Parse Excel medication list
export const parseExcelMedicationList = async (file: File): Promise<ImportedMedication[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        
        // Get first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        
        const medications: ImportedMedication[] = [];
        
        // Find header row
        let headerRow = -1;
        for (let i = 0; i < Math.min(10, jsonData.length); i++) {
          const row = jsonData[i];
          if (row.some((cell: any) => 
            cell && cell.toString().toLowerCase().includes('medication') ||
            cell && cell.toString().toLowerCase().includes('drug') ||
            cell && cell.toString().toLowerCase().includes('name')
          )) {
            headerRow = i;
            break;
          }
        }
        
        if (headerRow === -1) {
          // No header found, try to parse common formats
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (row && row.length >= 3) {
              medications.push({
                name: row[0]?.toString() || '',
                dose: row[1]?.toString() || '',
                frequency: row[2]?.toString() || '',
                route: row[3]?.toString() || 'By Mouth',
                prescriber: row[4]?.toString() || undefined,
                dateStarted: row[5]?.toString() || undefined,
                instructions: row[6]?.toString() || undefined
              });
            }
          }
        } else {
          // Parse with headers
          const headers = jsonData[headerRow].map((h: any) => h?.toString().toLowerCase() || '');
          
          const nameCol = headers.findIndex((h: string) => 
            h.includes('name') || h.includes('medication') || h.includes('drug')
          );
          const doseCol = headers.findIndex((h: string) => 
            h.includes('dose') || h.includes('dosage') || h.includes('strength')
          );
          const freqCol = headers.findIndex((h: string) => 
            h.includes('freq') || h.includes('schedule') || h.includes('timing')
          );
          const routeCol = headers.findIndex((h: string) => 
            h.includes('route') || h.includes('method')
          );
          const prescriberCol = headers.findIndex((h: string) => 
            h.includes('prescriber') || h.includes('doctor') || h.includes('provider')
          );
          const dateCol = headers.findIndex((h: string) => 
            h.includes('date') || h.includes('start')
          );
          const instructionsCol = headers.findIndex((h: string) => 
            h.includes('instruction') || h.includes('notes') || h.includes('directions')
          );
          
          for (let i = headerRow + 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (!row || row.length === 0) continue;
            
            const med: ImportedMedication = {
              name: nameCol >= 0 ? row[nameCol]?.toString() || '' : '',
              dose: doseCol >= 0 ? row[doseCol]?.toString() || '' : '',
              frequency: freqCol >= 0 ? row[freqCol]?.toString() || '' : '',
              route: routeCol >= 0 ? row[routeCol]?.toString() || 'By Mouth' : 'By Mouth',
              prescriber: prescriberCol >= 0 ? row[prescriberCol]?.toString() : undefined,
              dateStarted: dateCol >= 0 ? row[dateCol]?.toString() : undefined,
              instructions: instructionsCol >= 0 ? row[instructionsCol]?.toString() : undefined
            };
            
            if (med.name && med.dose) {
              medications.push(med);
            }
          }
        }
        
        resolve(medications);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsBinaryString(file);
  });
};

// Convert imported medication to full Medication object
export const convertImportedMedication = (
  imported: ImportedMedication,
  source: 'pdf-import' | 'excel-import'
): Omit<Medication, 'id' | 'createdAt' | 'updatedAt'> => {
  // Determine category based on frequency and route
  let category: Medication['category'] = 'daily';
  
  const freqLower = imported.frequency.toLowerCase();
  const routeLower = imported.route.toLowerCase();
  
  if (freqLower.includes('as needed') || freqLower.includes('prn')) {
    category = 'as-needed';
  } else if (freqLower.includes('week') || freqLower.includes('qweek')) {
    category = 'weekly';
  } else if (routeLower.includes('injection') || routeLower.includes('sc') || routeLower.includes('subcutaneous')) {
    category = 'injection';
  } else if (routeLower.includes('inhalation') || imported.name.toLowerCase().includes('inhaler')) {
    category = 'inhaler';
  } else if (imported.name.toLowerCase().includes('brace') || imported.name.toLowerCase().includes('stocking')) {
    category = 'device';
  } else if (imported.name.toLowerCase().includes('vitamin') || imported.name.toLowerCase().includes('d3-')) {
    category = 'supplement';
  }
  
  // Parse dose to extract amount and unit
  const doseMatch = imported.dose.match(/(\d+(?:\.\d+)?)\s*([a-zA-Z]+)/);
  const dosageAmount = doseMatch ? parseFloat(doseMatch[1]) : undefined;
  const dosageUnit = doseMatch ? doseMatch[2] : undefined;
  
  return {
    name: imported.name,
    dose: imported.dose,
    dosageAmount,
    dosageUnit,
    frequency: imported.frequency,
    route: imported.route,
    prescriber: imported.prescriber,
    dateStarted: imported.dateStarted,
    instructions: imported.instructions,
    category,
    active: true,
    source,
    importDate: new Date().toISOString()
  };
};

export default {
  parsePDFMedicationList,
  parseExcelMedicationList,
  convertImportedMedication
};
