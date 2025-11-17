import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Pill, Upload, Check, Clock, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  taken: boolean;
}

const MedicationDashboard: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Convert Excel data to medication format
        const meds = jsonData.map((row: any) => ({
          name: row['Medication'] || row['Name'] || 'Unknown',
          dosage: row['Dosage'] || row['Dose'] || 'N/A',
          frequency: row['Frequency'] || 'Daily',
          time: row['Time'] || 'Morning',
          taken: false,
        }));

        setMedications(meds);
        setUploading(false);
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        setUploading(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  const toggleMedication = (index: number) => {
    const updated = [...medications];
    updated[index].taken = !updated[index].taken;
    setMedications(updated);
  };

  const takenCount = medications.filter(m => m.taken).length;
  const totalCount = medications.length;

  return (
    <div className="medication-dashboard">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <Pill size={64} color="#4a5f7f" strokeWidth={1} style={{ marginBottom: '20px' }} />
          <h1 style={{ fontSize: '48px', fontWeight: '300', fontFamily: 'serif', color: '#c0c0c0', margin: '0 0 12px 0' }}>
            Medication Dashboard
          </h1>
          <p style={{ fontSize: '16px', color: '#808080', fontStyle: 'italic' }}>
            Track your 22+ medications with ease
          </p>
        </div>

        {/* Stats Card */}
        {medications.length > 0 && (
          <div style={{
            background: 'rgba(74, 95, 127, 0.2)',
            border: '1px solid #4a5f7f',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '30px',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '40px', fontWeight: '600', color: '#4a5f7f', margin: '0 0 8px 0' }}>
                {takenCount}/{totalCount}
              </p>
              <p style={{ fontSize: '14px', color: '#808080', margin: 0 }}>Medications Taken</p>
            </div>
            <div style={{ width: '1px', height: '60px', background: '#2a2a2a' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '40px', fontWeight: '600', color: '#5f7f4a', margin: '0 0 8px 0' }}>
                {Math.round((takenCount / totalCount) * 100)}%
              </p>
              <p style={{ fontSize: '14px', color: '#808080', margin: 0 }}>Completion</p>
            </div>
          </div>
        )}

        {/* Upload Section */}
        {medications.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: 'rgba(10, 10, 10, 0.8)',
              border: '2px dashed #4a5f7f',
              borderRadius: '16px',
              padding: '60px',
              textAlign: 'center',
              marginBottom: '30px',
            }}
          >
            <Upload size={48} color="#4a5f7f" style={{ marginBottom: '20px' }} />
            <h3 style={{ color: '#c0c0c0', fontSize: '20px', marginBottom: '12px' }}>
              Import Medication List
            </h3>
            <p style={{ color: '#808080', fontSize: '14px', marginBottom: '24px' }}>
              Upload your Excel file (med_list_20250930_181636.xls)
            </p>
            <label style={{
              display: 'inline-block',
              background: '#4a5f7f',
              color: '#ffffff',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
            }}>
              {uploading ? 'Uploading...' : 'Choose File'}
              <input
                type="file"
                accept=".xls,.xlsx"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </label>
          </motion.div>
        )}

        {/* Medication List */}
        {medications.length > 0 && (
          <div style={{
            background: 'rgba(10, 10, 10, 0.8)',
            borderRadius: '16px',
            padding: '30px',
            border: '1px solid #2a2a2a',
          }}>
            <h2 style={{ fontSize: '24px', color: '#c0c0c0', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Clock size={24} color="#4a5f7f" />
              Today's Medications
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {medications.map((med, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => toggleMedication(index)}
                  style={{
                    background: med.taken ? 'rgba(95, 127, 74, 0.2)' : '#0f0f0f',
                    border: `1px solid ${med.taken ? '#5f7f4a' : '#2a2a2a'}`,
                    borderRadius: '12px',
                    padding: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <motion.div
                      animate={{ scale: med.taken ? [1, 1.2, 1] : 1 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        border: `2px solid ${med.taken ? '#5f7f4a' : '#4a4a4a'}`,
                        background: med.taken ? '#5f7f4a' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {med.taken && <Check size={16} color="#ffffff" strokeWidth={3} />}
                    </motion.div>
                    <div>
                      <h4 style={{
                        color: med.taken ? '#5f7f4a' : '#c0c0c0',
                        fontSize: '16px',
                        fontWeight: '600',
                        margin: '0 0 4px 0',
                      }}>
                        {med.name}
                      </h4>
                      <p style={{
                        color: '#808080',
                        fontSize: '13px',
                        margin: 0,
                      }}>
                        {med.dosage} • {med.frequency}
                      </p>
                    </div>
                  </div>
                  <div style={{
                    background: med.taken ? '#5f7f4a' : '#2a2a2a',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: med.taken ? '#ffffff' : '#808080',
                  }}>
                    {med.time}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Re-upload Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                marginTop: '20px',
                width: '100%',
                background: '#0f0f0f',
                border: '1px solid #4a5f7f',
                borderRadius: '8px',
                padding: '12px',
                color: '#4a5f7f',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
              onClick={() => setMedications([])}
            >
              <Upload size={16} />
              Upload New List
            </motion.button>
          </div>
        )}

        {/* Safety Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            marginTop: '30px',
            padding: '20px',
            background: 'rgba(127, 74, 74, 0.1)',
            border: '1px solid #7f4a4a',
            borderRadius: '12px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start',
          }}
        >
          <AlertCircle size={20} color="#7f4a4a" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p style={{
            fontSize: '13px',
            color: '#c0c0c0',
            margin: 0,
            lineHeight: '1.6',
          }}>
            <strong>Privacy Note:</strong> All medication data is stored locally on your device using IndexedDB. 
            Nothing is uploaded to the cloud unless you explicitly choose to back it up.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MedicationDashboard;
