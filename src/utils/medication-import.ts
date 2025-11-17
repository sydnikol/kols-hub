import * as XLSX from 'xlsx';

export interface MedicationRecord {
  id?: number;
  name: string;
  dosage: string;
  frequency: string;
  timeOfDay: string[];
  prescribedFor: string;
  sideEffects: string[];
  notes?: string;
  startDate: Date;
  endDate?: Date;
  isPRN: boolean;
  lastTaken?: Date;
  takenToday?: boolean;
}

/**
 * Import medications from Excel file
 * Expects format from med_list_20250930_181636.xls
 */
export async function importMedicationsFromExcel(file: File): Promise<MedicationRecord[]> {
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
        
        // Parse the data
        const medications: MedicationRecord[] = [];
        
        // Skip header row, process data rows
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          
          // Skip empty rows
          if (!row || row.length === 0 || !row[0]) continue;
          
          // Map Excel columns to medication fields
          // Adjust column indices based on actual Excel structure
          const med: MedicationRecord = {
            name: String(row[0] || '').trim(),
            dosage: String(row[1] || '').trim(),
            frequency: String(row[2] || '').trim(),
            timeOfDay: parseTimeOfDay(String(row[3] || '')),
            prescribedFor: String(row[4] || '').trim(),
            sideEffects: parseSideEffects(String(row[5] || '')),
            notes: String(row[6] || '').trim(),
            startDate: parseDate(row[7]) || new Date(),
            isPRN: String(row[2] || '').toLowerCase().includes('prn') || 
                   String(row[2] || '').toLowerCase().includes('as needed'),
            takenToday: false
          };
          
          // Only add if has name and dosage
          if (med.name && med.dosage) {
            medications.push(med);
          }
        }
        
        resolve(medications);
      } catch (error) {
        reject(new Error(`Failed to parse Excel file: ${error}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsBinaryString(file);
  });
}

/**
 * Export medications to Excel file
 */
export function exportMedicationsToExcel(medications: MedicationRecord[]): void {
  // Create worksheet data
  const data = [
    ['Medication Name', 'Dosage', 'Frequency', 'Time of Day', 'Prescribed For', 'Side Effects', 'Notes', 'Start Date', 'Status']
  ];
  
  medications.forEach(med => {
    data.push([
      med.name,
      med.dosage,
      med.frequency,
      med.timeOfDay.join(', '),
      med.prescribedFor,
      med.sideEffects.join('; '),
      med.notes || '',
      med.startDate.toLocaleDateString(),
      med.isPRN ? 'PRN' : 'Scheduled'
    ]);
  });
  
  // Create workbook and worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Medications');
  
  // Set column widths
  worksheet['!cols'] = [
    { wch: 25 }, // Medication Name
    { wch: 15 }, // Dosage
    { wch: 15 }, // Frequency
    { wch: 20 }, // Time of Day
    { wch: 20 }, // Prescribed For
    { wch: 30 }, // Side Effects
    { wch: 30 }, // Notes
    { wch: 12 }, // Start Date
    { wch: 12 }  // Status
  ];
  
  // Generate filename with timestamp
  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `KOL_Medications_${timestamp}.xlsx`;
  
  // Save file
  XLSX.writeFile(workbook, filename);
}

/**
 * Parse time of day from string (e.g., "Morning, Evening" -> ["Morning", "Evening"])
 */
function parseTimeOfDay(timeString: string): string[] {
  if (!timeString) return [];
  
  const times = timeString.split(/[,;]/).map(t => t.trim()).filter(t => t.length > 0);
  return times.length > 0 ? times : ['Unspecified'];
}

/**
 * Parse side effects from string
 */
function parseSideEffects(effectsString: string): string[] {
  if (!effectsString) return [];
  
  const effects = effectsString.split(/[,;]/).map(e => e.trim()).filter(e => e.length > 0);
  return effects;
}

/**
 * Parse date from various formats
 */
function parseDate(dateValue: any): Date | null {
  if (!dateValue) return null;
  
  if (dateValue instanceof Date) return dateValue;
  
  if (typeof dateValue === 'number') {
    // Excel date number
    return XLSX.SSF.parse_date_code(dateValue);
  }
  
  if (typeof dateValue === 'string') {
    const parsed = new Date(dateValue);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  
  return null;
}

/**
 * Create a printable medication schedule PDF/HTML
 */
export function createPrintableMedicationSchedule(medications: MedicationRecord[]): string {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>KOL Medication Schedule</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 20px auto;
          padding: 20px;
        }
        h1 {
          color: #6600cc;
          border-bottom: 3px solid #6600cc;
          padding-bottom: 10px;
        }
        .med-card {
          border: 2px solid #9d00ff;
          border-radius: 8px;
          padding: 15px;
          margin: 15px 0;
          break-inside: avoid;
        }
        .med-name {
          font-size: 18px;
          font-weight: bold;
          color: #6600cc;
        }
        .med-dosage {
          font-size: 16px;
          color: #333;
          margin: 5px 0;
        }
        .med-time {
          background: #f0e6ff;
          padding: 5px 10px;
          border-radius: 4px;
          display: inline-block;
          margin: 3px;
        }
        .med-notes {
          font-style: italic;
          color: #666;
          margin-top: 10px;
        }
        .side-effects {
          color: #cc0000;
          font-size: 14px;
        }
        @media print {
          body { margin: 0; padding: 10px; }
          .med-card { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <h1>🖤 KOL Medication Schedule</h1>
      <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
      ${medications.map(med => `
        <div class="med-card">
          <div class="med-name">${med.name}</div>
          <div class="med-dosage">${med.dosage} - ${med.frequency}</div>
          <div>
            ${med.timeOfDay.map(time => `<span class="med-time">${time}</span>`).join('')}
            ${med.isPRN ? '<span class="med-time" style="background: #7f1d1d;">PRN</span>' : ''}
          </div>
          ${med.prescribedFor ? `<div><strong>For:</strong> ${med.prescribedFor}</div>` : ''}
          ${med.sideEffects.length > 0 ? `
            <div class="side-effects">
              <strong>⚠️ Side Effects:</strong> ${med.sideEffects.join(', ')}
            </div>
          ` : ''}
          ${med.notes ? `<div class="med-notes">${med.notes}</div>` : ''}
        </div>
      `).join('')}
    </body>
    </html>
  `;
  
  return html;
}
