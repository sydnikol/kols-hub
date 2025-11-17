import React, { useState } from 'react';
import { Upload, File, CheckCircle, AlertCircle } from 'lucide-react';
import { parseExcelMedicationList, parsePDFMedicationList, convertImportedMedication } from '../services/medicationImport';
import { medicationService } from '../services/medicationDatabase';

const MedicationImporter: React.FC = () => {
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setError('');
    
    try {
      let meds: any[] = [];
      
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        meds = await parseExcelMedicationList(file);
      } else if (file.name.endsWith('.pdf')) {
        // For PDF, we need to extract text first
        const reader = new FileReader();
        reader.onload = async (e) => {
          const text = e.target?.result as string;
          meds = parsePDFMedicationList(text);
          setImported(meds);
        };
        reader.readAsText(file);
        setImporting(false);
        return;
      }
      
      setImported(meds);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setImporting(false);
    }
  };

  const handleImportAll = async () => {
    try {
      const medObjects = imported.map(m => 
        convertImportedMedication(m, 
          imported[0]?.source || 'excel-import'
        )
      );
      await medicationService.addMedications(medObjects);
      alert(`Successfully imported ${medObjects.length} medications!`);
      setImported([]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-purple-500/10 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Import Medications</h2>
        
        <div className="mb-4">
          <label className="block w-full cursor-pointer">
            <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-8 text-center hover:border-purple-500/50 transition-colors">
              <Upload className="mx-auto mb-4" size={48} />
              <p className="text-gray-300 mb-2">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-400">Supports PDF (myUHealth) or Excel (.xlsx, .xls)</p>
              <input
                type="file"
                accept=".pdf,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </label>
        </div>

        {importing && <p className="text-center text-gray-400">Importing...</p>}
        {error && (
          <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {imported.length > 0 && (
        <div className="bg-purple-500/10 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Preview ({imported.length} medications)</h3>
            <button
              onClick={handleImportAll}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              Import All
            </button>
          </div>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {imported.map((med, i) => (
              <div key={i} className="flex items-center gap-4 bg-purple-500/5 border border-purple-500/20 rounded-lg p-3">
                <CheckCircle size={16} className="text-green-400" />
                <div className="flex-1">
                  <p className="font-semibold">{med.name}</p>
                  <p className="text-sm text-gray-400">{med.dose} - {med.frequency}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationImporter;
