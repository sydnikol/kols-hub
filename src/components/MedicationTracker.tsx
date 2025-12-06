import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import {
  Calendar,
  Clock,
  Pill,
  AlertCircle,
  Upload,
  Save,
  Check,
  X,
  RefreshCw,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import { MY_MEDICATIONS } from '../data/medications';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timeOfDay: string[];
  prescriber: string;
  pharmacy: string;
  refillDate: string;
  quantity: number;
  notes: string;
  active: boolean;
  taken: {
    morning?: boolean;
    afternoon?: boolean;
    evening?: boolean;
    night?: boolean;
  };
}

const MedicationTracker: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(false);
  const [importedFileName, setImportedFileName] = useState<string>('');

  // Load medications from localStorage on mount, or use real meds as default
  useEffect(() => {
    const savedMeds = localStorage.getItem('kol_medications');
    if (savedMeds) {
      setMedications(JSON.parse(savedMeds));
    } else {
      // Pre-load with Sydney's real medications from medications.ts
      const realMeds: Medication[] = MY_MEDICATIONS
        .filter(med => med.status === 'Active')
        .map((med, index) => {
          // Parse time of day from frequency
          const timeOfDay: string[] = [];
          const freqLower = med.frequency.toLowerCase();
          if (freqLower.includes('morning') || freqLower.includes('daily') || freqLower.includes('once')) {
            timeOfDay.push('morning');
          }
          if (freqLower.includes('twice') || freqLower.includes('bid') || freqLower.includes('2 times')) {
            timeOfDay.push('morning', 'evening');
          }
          if (freqLower.includes('three') || freqLower.includes('tid') || freqLower.includes('3 times')) {
            timeOfDay.push('morning', 'afternoon', 'evening');
          }
          if (freqLower.includes('bedtime') || freqLower.includes('night') || freqLower.includes('at night')) {
            timeOfDay.push('night');
          }
          if (freqLower.includes('as needed') || freqLower.includes('prn')) {
            timeOfDay.push('morning'); // Default for PRN
          }
          if (timeOfDay.length === 0) timeOfDay.push('morning');

          return {
            id: `med_real_${index}`,
            name: med.drugName,
            dosage: `${med.strength} - ${med.dosage}`,
            frequency: med.frequency,
            timeOfDay: [...new Set(timeOfDay)], // Remove duplicates
            prescriber: med.prescriber || '',
            pharmacy: 'CVS Pharmacy',
            refillDate: '',
            quantity: 30,
            notes: med.notes || '',
            active: true,
            taken: {}
          };
        });
      setMedications(realMeds);
    }
  }, []);

  // Save medications to localStorage whenever they change
  useEffect(() => {
    if (medications.length > 0) {
      localStorage.setItem('kol_medications', JSON.stringify(medications));
    }
  }, [medications]);

  // Handle Excel file import (specifically for med_list_20250930_181636.xls)
  const handleExcelImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setImportedFileName(file.name);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Parse the Excel data and map to our medication structure
      const importedMeds: Medication[] = jsonData.map((row: any, index) => {
        // Try to intelligently map common column names
        const name = row['Medication Name'] || row['Drug Name'] || row['Medication'] || row['Name'] || '';
        const dosage = row['Dosage'] || row['Dose'] || row['Strength'] || '';
        const frequency = row['Frequency'] || row['Sig'] || row['Directions'] || '';
        const prescriber = row['Prescriber'] || row['Doctor'] || row['Provider'] || '';
        const pharmacy = row['Pharmacy'] || row['Location'] || '';
        const quantity = parseInt(row['Quantity'] || row['Qty'] || row['Amount'] || '30');
        const refillDate = row['Refill Date'] || row['Next Refill'] || '';

        // Parse time of day from frequency or directions
        const timeOfDay = [];
        const freqLower = frequency.toLowerCase();
        if (freqLower.includes('morning') || freqLower.includes('am')) timeOfDay.push('morning');
        if (freqLower.includes('afternoon') || freqLower.includes('noon')) timeOfDay.push('afternoon');
        if (freqLower.includes('evening') || freqLower.includes('pm')) timeOfDay.push('evening');
        if (freqLower.includes('bedtime') || freqLower.includes('night')) timeOfDay.push('night');
        if (freqLower.includes('twice') || freqLower.includes('bid')) {
          timeOfDay.push('morning', 'evening');
        }
        if (freqLower.includes('three') || freqLower.includes('tid')) {
          timeOfDay.push('morning', 'afternoon', 'evening');
        }
        if (freqLower.includes('four') || freqLower.includes('qid')) {
          timeOfDay.push('morning', 'afternoon', 'evening', 'night');
        }
        if (timeOfDay.length === 0) timeOfDay.push('morning'); // Default

        return {
          id: `med_${Date.now()}_${index}`,
          name: name || `Medication ${index + 1}`,
          dosage,
          frequency,
          timeOfDay,
          prescriber,
          pharmacy,
          refillDate,
          quantity,
          notes: row['Notes'] || row['Instructions'] || '',
          active: true,
          taken: {}
        };
      });

      setMedications(prevMeds => [...prevMeds, ...importedMeds]);
      toast.success(`Successfully imported ${importedMeds.length} medications from ${file.name}`);
      
      // Reset file input
      event.target.value = '';
    } catch (error) {
      console.error('Error importing Excel file:', error);
      toast.error('Failed to import medications. Please check the file format.');
    } finally {
      setLoading(false);
    }
  };

  // Export medications to Excel
  const handleExcelExport = () => {
    const exportData = medications.map(med => ({
      'Medication Name': med.name,
      'Dosage': med.dosage,
      'Frequency': med.frequency,
      'Time of Day': med.timeOfDay.join(', '),
      'Prescriber': med.prescriber,
      'Pharmacy': med.pharmacy,
      'Refill Date': med.refillDate,
      'Quantity': med.quantity,
      'Notes': med.notes,
      'Active': med.active ? 'Yes' : 'No'
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Medications');
    
    const fileName = `kol_medications_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    toast.success(`Exported ${medications.length} medications to ${fileName}`);
  };

  // Toggle medication taken status
  const toggleMedicationTaken = (medId: string, timeOfDay: string) => {
    setMedications(prevMeds =>
      prevMeds.map(med =>
        med.id === medId
          ? { ...med, taken: { ...med.taken, [timeOfDay]: !med.taken[timeOfDay] } }
          : med
      )
    );
  };

  // Reset daily checkmarks
  const resetDailyChecks = () => {
    setMedications(prevMeds =>
      prevMeds.map(med => ({ ...med, taken: {} }))
    );
    toast.success('Daily medication checks reset');
  };

  // Get medications for specific time of day
  const getMedicationsByTime = (time: string) => {
    return medications.filter(med => med.active && med.timeOfDay.includes(time));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-black to-pink-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Medication Tracker
          </h1>
          <p className="text-gray-400">Managing your health with precision and care</p>
        </div>

        {/* Import/Export Controls */}
        <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 mb-8 border border-purple-500/20">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FileSpreadsheet className="mr-2" />
            Data Management
          </h2>
          
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg cursor-pointer transition-colors">
              <Upload className="mr-2" size={20} />
              Import Excel
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleExcelImport}
                className="hidden"
                disabled={loading}
              />
            </label>

            <button
              onClick={handleExcelExport}
              className="flex items-center px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors"
              disabled={medications.length === 0}
            >
              <Download className="mr-2" size={20} />
              Export to Excel
            </button>

            <button
              onClick={resetDailyChecks}
              className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <RefreshCw className="mr-2" size={20} />
              Reset Daily Checks
            </button>
          </div>

          {importedFileName && (
            <p className="mt-4 text-green-400">
              Last import: {importedFileName}
            </p>
          )}

          {loading && (
            <div className="mt-4 text-yellow-400 flex items-center">
              <RefreshCw className="animate-spin mr-2" size={20} />
              Processing file...
            </div>
          )}
        </div>

        {/* Medication Schedule by Time */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {['morning', 'afternoon', 'evening', 'night'].map((time) => {
            const timeMeds = getMedicationsByTime(time);
            return (
              <div key={time} className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-lg font-semibold capitalize mb-4 flex items-center">
                  <Clock className="mr-2" size={20} />
                  {time}
                </h3>
                <div className="space-y-3">
                  {timeMeds.length === 0 ? (
                    <p className="text-gray-500 text-sm">No medications scheduled</p>
                  ) : (
                    timeMeds.map(med => (
                      <div key={`${med.id}_${time}`} className="flex items-center justify-between p-3 bg-purple-900/20 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{med.name}</p>
                          <p className="text-sm text-gray-400">{med.dosage}</p>
                        </div>
                        <button
                          onClick={() => toggleMedicationTaken(med.id, time)}
                          className={`p-2 rounded-lg transition-all ${
                            med.taken[time as keyof typeof med.taken]
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-700 hover:bg-gray-600'
                          }`}
                        >
                          {med.taken[time as keyof typeof med.taken] ? (
                            <Check size={20} />
                          ) : (
                            <Pill size={20} />
                          )}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* All Medications List */}
        {medications.length > 0 && (
          <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Pill className="mr-2" />
              All Medications ({medications.length})
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-purple-500/20">
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Dosage</th>
                    <th className="text-left p-2">Frequency</th>
                    <th className="text-left p-2">Prescriber</th>
                    <th className="text-left p-2">Pharmacy</th>
                    <th className="text-left p-2">Refill Date</th>
                    <th className="text-center p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {medications.map(med => (
                    <tr key={med.id} className="border-b border-purple-500/10 hover:bg-purple-900/20">
                      <td className="p-2 font-medium">{med.name}</td>
                      <td className="p-2">{med.dosage}</td>
                      <td className="p-2">{med.frequency}</td>
                      <td className="p-2">{med.prescriber}</td>
                      <td className="p-2">{med.pharmacy}</td>
                      <td className="p-2">{med.refillDate}</td>
                      <td className="p-2 text-center">
                        {med.active ? (
                          <span className="text-green-400">Active</span>
                        ) : (
                          <span className="text-gray-500">Inactive</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {medications.length === 0 && !loading && (
          <div className="bg-black/40 backdrop-blur-lg rounded-xl p-12 text-center border border-purple-500/20">
            <Pill className="mx-auto mb-4 text-gray-500" size={48} />
            <h3 className="text-xl font-semibold mb-2">No Medications Yet</h3>
            <p className="text-gray-400 mb-4">
              Import your medication list using the Excel file:
            </p>
            <p className="text-purple-400 font-mono">med_list_20250930_181636.xls</p>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-purple-900/20 rounded-xl p-6 border border-purple-500/20">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <AlertCircle className="mr-2" />
            Quick Guide
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• Import your medications from Excel file (med_list_20250930_181636.xls)</li>
            <li>• Check off medications as you take them throughout the day</li>
            <li>• Reset daily checks each morning to track today's doses</li>
            <li>• Export your medication list to share with healthcare providers</li>
            <li>• All data is stored locally on your device for privacy</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MedicationTracker;