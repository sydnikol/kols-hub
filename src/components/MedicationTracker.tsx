import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { 
  medicationService, 
  logService, 
  reminderService,
  pharmacyService,
  prescriberService
} from '../services/medicationDatabase';
import { Medication, MedicationStats } from '../types/medication';
import { 
  Plus, 
  Calendar, 
  Clock, 
  Pill, 
  FileUp, 
  Download,
  TrendingUp,
  AlertCircle,
  Check,
  X
} from 'lucide-react';
import MedicationList from './MedicationList';
import MedicationForm from './MedicationForm';
import MedicationLog from './MedicationLog';
import MedicationImporter from './MedicationImporter';
import MedicationStats from './MedicationStatsDisplay';

const MedicationTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'medications' | 'log' | 'reminders' | 'import'>('overview');
  const [showAddMedication, setShowAddMedication] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  
  // Live queries
  const medications = useLiveQuery(() => medicationService.getAllMedications(), []);
  const activeMedications = useLiveQuery(() => medicationService.getActiveMedications(), []);
  const todayLogs = useLiveQuery(() => logService.getTodayLogs(), []);
  const enabledReminders = useLiveQuery(() => reminderService.getEnabledReminders(), []);
  
  const [stats, setStats] = useState<MedicationStats>({
    totalActive: 0,
    totalInactive: 0,
    adherenceRate: 0,
    takenToday: 0,
    missedToday: 0,
    needingRefill: 0,
    upcomingReminders: 0
  });

  // Calculate stats
  useEffect(() => {
    if (!medications || !todayLogs || !enabledReminders) return;
    
    const active = medications.filter(m => m.active);
    const inactive = medications.filter(m => !m.active);
    const needsRefill = medications.filter(m => m.needsRefill);
    
    // Calculate adherence
    const dailyMeds = active.filter(m => 
      m.category === 'daily' && 
      !m.frequency.toLowerCase().includes('as needed')
    );
    const taken = todayLogs.filter(l => !l.skipped);
    const adherence = dailyMeds.length > 0 
      ? Math.round((taken.length / dailyMeds.length) * 100) 
      : 100;
    
    setStats({
      totalActive: active.length,
      totalInactive: inactive.length,
      adherenceRate: adherence,
      takenToday: taken.length,
      missedToday: Math.max(0, dailyMeds.length - taken.length),
      needingRefill: needsRefill.length,
      upcomingReminders: enabledReminders.length
    });
  }, [medications, todayLogs, enabledReminders]);

  const handleAddMedication = () => {
    setSelectedMedication(null);
    setShowAddMedication(true);
  };

  const handleEditMedication = (medication: Medication) => {
    setSelectedMedication(medication);
    setShowAddMedication(true);
  };

  const handleMedicationSaved = () => {
    setShowAddMedication(false);
    setSelectedMedication(null);
  };

  const handleLogMedication = async (medicationId: string) => {
    const medication = medications?.find(m => m.id === medicationId);
    if (!medication) return;
    
    await logService.logMedication({
      medicationId,
      medicationName: medication.name,
      takenAt: new Date().toISOString(),
      dose: medication.dose
    });
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <div className="p-6 border-b border-purple-500/30">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              💊 Medication Tracker
            </h1>
            <p className="text-gray-400 mt-1">Comprehensive health management</p>
          </div>
          <button
            onClick={handleAddMedication}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            <Plus size={20} />
            Add Medication
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-purple-500/10 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 text-purple-400 mb-2">
              <Pill size={16} />
              <span className="text-sm">Active</span>
            </div>
            <div className="text-2xl font-bold">{stats.totalActive}</div>
          </div>
          
          <div className="bg-green-500/10 backdrop-blur-sm border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-400 mb-2">
              <Check size={16} />
              <span className="text-sm">Taken Today</span>
            </div>
            <div className="text-2xl font-bold">{stats.takenToday}</div>
          </div>
          
          <div className="bg-indigo-500/10 backdrop-blur-sm border border-indigo-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <AlertCircle size={16} />
              <span className="text-sm">Need Refill</span>
            </div>
            <div className="text-2xl font-bold">{stats.needingRefill}</div>
          </div>
          
          <div className="bg-blue-500/10 backdrop-blur-sm border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <TrendingUp size={16} />
              <span className="text-sm">Adherence</span>
            </div>
            <div className="text-2xl font-bold">{stats.adherenceRate}%</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-6 py-4 border-b border-purple-500/30">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'medications', label: 'Medications', icon: Pill },
          { id: 'log', label: 'Log', icon: Calendar },
          { id: 'reminders', label: 'Reminders', icon: Clock },
          { id: 'import', label: 'Import', icon: FileUp }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'bg-purple-500/10 text-gray-400 hover:bg-purple-500/20'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'overview' && (
          <MedicationStatsDisplay 
            stats={stats} 
            medications={medications || []}
            todayLogs={todayLogs || []}
          />
        )}
        
        {activeTab === 'medications' && (
          <MedicationList
            medications={medications || []}
            onEdit={handleEditMedication}
            onLog={handleLogMedication}
          />
        )}
        
        {activeTab === 'log' && (
          <MedicationLog logs={todayLogs || []} />
        )}
        
        {activeTab === 'import' && (
          <MedicationImporter />
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddMedication && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-purple-500/30 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <MedicationForm
              medication={selectedMedication}
              onSave={handleMedicationSaved}
              onCancel={() => setShowAddMedication(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationTracker;
