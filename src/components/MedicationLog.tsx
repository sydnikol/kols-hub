import React from 'react';
import { MedicationLog as Log } from '../types/medication';
import { Check, X, Clock } from 'lucide-react';

interface Props {
  logs: Log[];
}

const MedicationLog: React.FC<Props> = ({ logs }) => {
  return (
    <div className="space-y-4">
      <div className="bg-purple-500/10 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Today's Medication Log</h2>
        
        {logs.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No medications logged yet today</p>
        ) : (
          <div className="space-y-3">
            {logs.map(log => (
              <div
                key={log.id}
                className="flex items-center gap-4 bg-purple-500/5 border border-purple-500/20 rounded-lg p-4"
              >
                {log.skipped ? (
                  <X size={20} className="text-red-400" />
                ) : (
                  <Check size={20} className="text-green-400" />
                )}
                
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{log.medicationName}</h3>
                  <p className="text-sm text-gray-400">{log.dose}</p>
                  {log.notes && <p className="text-sm text-gray-400 mt-1">{log.notes}</p>}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock size={14} />
                  {new Date(log.takenAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationLog;
