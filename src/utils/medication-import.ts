import * as XLSX from 'xlsx';
import type { MedicationRecord } from './database';

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

          // Map Excel columns to medication fields (database schema)
          const drugName = String(row[0] || '').trim();
          const genericName = String(row[1] || '').trim();
          const strength = String(row[2] || '').trim();
          const dosage = String(row[3] || '').trim();
          const frequency = String(row[4] || '').trim();
          const prescriber = String(row[5] || '').trim();
          const pharmacy = String(row[6] || '').trim();
          const notes = String(row[7] || '').trim();
          const startDate = parseDate(row[8]);
          const refills = row[9] ? Number(row[9]) : undefined;

          const med: MedicationRecord = {
            drugName,
            genericName: genericName || undefined,
            strength,
            dosage,
            frequency,
            prescriber: prescriber || undefined,
            pharmacy: pharmacy || undefined,
            status: 'Active',
            startDate: startDate || undefined,
            refills,
            notes: notes || undefined,
            taken: false
          };

          // Only add if has drug name and dosage
          if (med.drugName && med.dosage) {
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
    ['Drug Name', 'Generic Name', 'Strength', 'Dosage', 'Frequency', 'Prescriber', 'Pharmacy', 'Notes', 'Start Date', 'Refills', 'Status']
  ];

  medications.forEach(med => {
    data.push([
      med.drugName,
      med.genericName || '',
      med.strength,
      med.dosage,
      med.frequency,
      med.prescriber || '',
      med.pharmacy || '',
      med.notes || '',
      med.startDate ? new Date(med.startDate).toLocaleDateString() : '',
      med.refills?.toString() || '',
      med.status
    ]);
  });

  // Create workbook and worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Medications');

  // Set column widths
  worksheet['!cols'] = [
    { wch: 25 }, // Drug Name
    { wch: 20 }, // Generic Name
    { wch: 15 }, // Strength
    { wch: 15 }, // Dosage
    { wch: 15 }, // Frequency
    { wch: 20 }, // Prescriber
    { wch: 20 }, // Pharmacy
    { wch: 30 }, // Notes
    { wch: 12 }, // Start Date
    { wch: 10 }, // Refills
    { wch: 12 }  // Status
  ];

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `KOL_Medications_${timestamp}.xlsx`;

  // Save file
  XLSX.writeFile(workbook, filename);
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
        .med-details {
          margin: 10px 0;
        }
        .med-notes {
          font-style: italic;
          color: #666;
          margin-top: 10px;
        }
        .status-active {
          background: #10b981;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }
        .status-inactive {
          background: #6b7280;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
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
          <div class="med-name">${med.drugName}</div>
          ${med.genericName ? `<div style="color: #6b7280; font-size: 14px;">${med.genericName}</div>` : ''}
          <div class="med-dosage">${med.strength} - ${med.dosage}</div>
          <div class="med-details">
            <strong>Frequency:</strong> ${med.frequency}<br>
            ${med.prescriber ? `<strong>Prescriber:</strong> ${med.prescriber}<br>` : ''}
            ${med.pharmacy ? `<strong>Pharmacy:</strong> ${med.pharmacy}<br>` : ''}
            ${med.refills !== undefined ? `<strong>Refills:</strong> ${med.refills}<br>` : ''}
            <span class="status-${med.status.toLowerCase()}">${med.status}</span>
          </div>
          ${med.notes ? `<div class="med-notes">${med.notes}</div>` : ''}
        </div>
      `).join('')}
    </body>
    </html>
  `;

  return html;
}
