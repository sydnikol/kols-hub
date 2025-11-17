import React, { useState } from 'react';
import { Medication } from '../types/medication';
import { Edit, Trash2, Clock, Check, AlertCircle, Calendar } from 'lucide-react';
import { medicationService } from '../services/medicationDatabase';

interface MedicationListProps {
  medications: Medication[];
  onEdit: (medication: Medication) => void;
  onLog: (medicationId: string) => void;
}

const MedicationList: React.FC<MedicationListProps> = ({ medications, onEdit, onLog }) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('active');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  const filtered = medications.filter(m => {
    if (filter === 'active' && !m.active) return false;
    if (filter === 'inactive' && m.active) return false;
    if (categoryFilter !== 'all' && m.category !== categoryFilter) return false;
    return true;
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this medication?')) {
      await medicationService.deleteMedication(id);
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'daily': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'as-needed': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      case 'weekly': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'injection': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'inhaler': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'device': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'supplement': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-2">
          {['all', 'active', 'inactive'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                filter === f
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-500/10 text-gray-400 hover:bg-purple-500/20'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-white"
        >
          <option value="all">All Categories</option>
          <option value="daily">Daily</option>
          <option value="as-needed">As Needed</option>
          <option value="weekly">Weekly</option>
          <option value="injection">Injection</option>
          <option value="inhaler">Inhaler</option>
          <option value="device">Device</option>
          <option value="supplement">Supplement</option>
        </select>
      </div>

      {/* Medication Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(med => (
          <div
            key={med.id}
            className="bg-purple-500/10 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 hover:border-purple-500/50 transition-colors"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">{med.name}</h3>
                {med.category && (
                  <span className={`inline-block px-2 py-1 rounded text-xs border ${getCategoryColor(med.category)}`}>
                    {med.category}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(med)}
                  className="p-2 hover:bg-purple-500/20 rounded transition-colors"
                >
                  <Edit size={16} className="text-purple-400" />
                </button>
                <button
                  onClick={() => handleDelete(med.id)}
                  className="p-2 hover:bg-red-500/20 rounded transition-colors"
                >
                  <Trash2 size={16} className="text-red-400" />
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-2 text-sm text-gray-300 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Dose:</span>
                <span className="font-semibold">{med.dose}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-gray-400" />
                <span>{med.frequency}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Route:</span>
                <span>{med.route}</span>
              </div>
              {med.prescriber && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Prescriber:</span>
                  <span>{med.prescriber}</span>
                </div>
              )}
              {med.lastTaken && (
                <div className="flex items-center gap-2 text-green-400">
                  <Check size={14} />
                  <span>Last taken: {new Date(med.lastTaken).toLocaleString()}</span>
                </div>
              )}
              {med.needsRefill && (
                <div className="flex items-center gap-2 text-indigo-400">
                  <AlertCircle size={14} />
                  <span>Needs refill</span>
                </div>
              )}
            </div>

            {/* Quick Log Button */}
            {med.active && (
              <button
                onClick={() => onLog(med.id)}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Check size={16} />
                Log as Taken
              </button>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p>No medications found</p>
        </div>
      )}
    </div>
  );
};

export default MedicationList;
