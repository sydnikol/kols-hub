import { useState } from 'react'
import { Pill, Calendar, Clock, AlertCircle, Plus, Upload, Download, Heart, Activity, TrendingUp, FileText, Bell, CheckCircle, X } from 'lucide-react'
import * as XLSX from 'xlsx'

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  time: string[]
  prescribedBy: string
  startDate: string
  endDate?: string
  refillDate?: string
  notes?: string
  sideEffects?: string[]
  taken: boolean[]
}

interface HealthMetric {
  date: string
  bloodPressure?: string
  heartRate?: number
  weight?: number
  glucose?: number
  temperature?: number
  painLevel?: number
  notes?: string
}

interface EDSSymptom {
  date: string
  jointLocation: string
  severity: number
  triggers?: string
  duration: string
  notes?: string
}

function HealthTracker() {
  const [medications, setMedications] = useState<Medication[]>([])
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([])
  const [edsSymptoms, setEdsSymptoms] = useState<EDSSymptom[]>([])
  const [view, setView] = useState<'medications' | 'metrics' | 'calendar' | 'eds'>('medications')
  const [showAddMed, setShowAddMed] = useState(false)
  const [showAddMetric, setShowAddMetric] = useState(false)
  const [showAddEDS, setShowAddEDS] = useState(false)

  // Import medications from Excel file
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      // Convert Excel data to Medication format
      const importedMeds: Medication[] = jsonData.map((row: any, index: number) => ({
        id: `med-${Date.now()}-${index}`,
        name: row['Medication Name'] || row['Name'] || 'Unknown Medication',
        dosage: row['Dosage'] || row['Dose'] || '',
        frequency: row['Frequency'] || row['How Often'] || '',
        time: row['Time']?.split(',') || ['08:00'],
        prescribedBy: row['Doctor'] || row['Prescribed By'] || 'Unknown',
        startDate: row['Start Date'] || new Date().toISOString().split('T')[0],
        refillDate: row['Refill Date'] || row['Next Refill'] || '',
        notes: row['Notes'] || row['Instructions'] || '',
        sideEffects: row['Side Effects']?.split(',') || [],
        taken: []
      }))

      setMedications([...medications, ...importedMeds])
      alert(`Successfully imported ${importedMeds.length} medications! 💊✨`)
    }
    reader.readAsArrayBuffer(file)
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(medications.map(med => ({
      'Medication Name': med.name,
      'Dosage': med.dosage,
      'Frequency': med.frequency,
      'Time': med.time.join(', '),
      'Prescribed By': med.prescribedBy,
      'Start Date': med.startDate,
      'Refill Date': med.refillDate || '',
      'Notes': med.notes || '',
      'Side Effects': med.sideEffects?.join(', ') || ''
    })))
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Medications')
    XLSX.writeFile(workbook, `medication_list_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const addHealthMetric = (metric: Omit<HealthMetric, 'date'>) => {
    setHealthMetrics([
      ...healthMetrics,
      { ...metric, date: new Date().toISOString().split('T')[0] }
    ])
    setShowAddMetric(false)
  }

  const addEDSSymptom = (symptom: Omit<EDSSymptom, 'date'>) => {
    setEdsSymptoms([
      ...edsSymptoms,
      { ...symptom, date: new Date().toISOString().split('T')[0] }
    ])
    setShowAddEDS(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">🏥 Health Tracker</h1>
              <p className="text-cyan-200">
                EDS Type 3 Management • Medication Tracking • Pain Journaling
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => document.getElementById('file-upload')?.click()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all duration-200 flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>Import Excel</span>
              </button>
              <input
                id="file-upload"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={exportToExcel}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-all duration-200 flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* View Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <button
            onClick={() => setView('medications')}
            className={`p-4 rounded-xl transition-all duration-200 ${
              view === 'medications'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Pill className="h-6 w-6 mx-auto mb-2" />
            <p className="font-semibold">Medications</p>
          </button>
          <button
            onClick={() => setView('eds')}
            className={`p-4 rounded-xl transition-all duration-200 ${
              view === 'eds'
                ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg scale-105'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Activity className="h-6 w-6 mx-auto mb-2" />
            <p className="font-semibold">EDS Tracking</p>
          </button>
          <button
            onClick={() => setView('metrics')}
            className={`p-4 rounded-xl transition-all duration-200 ${
              view === 'metrics'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg scale-105'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <TrendingUp className="h-6 w-6 mx-auto mb-2" />
            <p className="font-semibold">Health Metrics</p>
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`p-4 rounded-xl transition-all duration-200 ${
              view === 'calendar'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg scale-105'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Calendar className="h-6 w-6 mx-auto mb-2" />
            <p className="font-semibold">Calendar</p>
          </button>
        </div>

        {/* Medications View */}
        {view === 'medications' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">💊 Medications ({medications.length})</h2>
              <button
                onClick={() => setShowAddMed(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Medication</span>
              </button>
            </div>

            {medications.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 text-center border border-white/20">
                <Pill className="h-16 w-16 mx-auto mb-4 text-cyan-300 opacity-50" />
                <h3 className="text-xl font-semibold text-white mb-2">No Medications Yet</h3>
                <p className="text-cyan-200 mb-6">
                  Upload your medication list (Excel file) or add medications manually
                </p>
                <button
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold"
                >
                  Import Medication List
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {medications.map((med) => (
                  <div
                    key={med.id}
                    className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-purple-500/50 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">{med.name}</h3>
                        <p className="text-cyan-200">{med.dosage} • {med.frequency}</p>
                      </div>
                      <Pill className="h-6 w-6 text-purple-400" />
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2 text-gray-300">
                        <Clock className="h-4 w-4" />
                        <span>Times: {med.time.join(', ')}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-300">
                        <FileText className="h-4 w-4" />
                        <span>Prescribed by: {med.prescribedBy}</span>
                      </div>
                      {med.refillDate && (
                        <div className="flex items-center space-x-2 text-gray-300">
                          <Bell className="h-4 w-4" />
                          <span>Refill: {med.refillDate}</span>
                        </div>
                      )}
                    </div>

                    {med.notes && (
                      <div className="mt-4 p-3 bg-cyan-900/30 rounded-lg">
                        <p className="text-sm text-cyan-100">{med.notes}</p>
                      </div>
                    )}

                    {med.sideEffects && med.sideEffects.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {med.sideEffects.map((effect, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-orange-600/30 border border-orange-500/50 rounded-full text-xs text-orange-200"
                          >
                            {effect}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* EDS Tracking View */}
        {view === 'eds' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">🦴 EDS Type 3 Tracking</h2>
                <p className="text-cyan-200">Ehlers-Danlos Syndrome & Joint Hypermobility Management</p>
              </div>
              <button
                onClick={() => setShowAddEDS(true)}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Log Symptom</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-xl p-6 text-white">
                <Activity className="h-8 w-8 mb-3 opacity-75" />
                <h3 className="text-3xl font-bold mb-1">{edsSymptoms.length}</h3>
                <p className="text-sm opacity-90">Symptoms Logged</p>
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white">
                <Heart className="h-8 w-8 mb-3 opacity-75" />
                <h3 className="text-3xl font-bold mb-1">
                  {edsSymptoms.length > 0
                    ? Math.round(
                        edsSymptoms.reduce((acc, s) => acc + s.severity, 0) / edsSymptoms.length
                      )
                    : 0}
                </h3>
                <p className="text-sm opacity-90">Avg Pain Level</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl p-6 text-white">
                <Clock className="h-8 w-8 mb-3 opacity-75" />
                <h3 className="text-3xl font-bold mb-1">
                  {edsSymptoms.length > 0
                    ? new Date(edsSymptoms[edsSymptoms.length - 1].date).toLocaleDateString()
                    : 'N/A'}
                </h3>
                <p className="text-sm opacity-90">Last Entry</p>
              </div>
            </div>

            {edsSymptoms.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 text-center border border-white/20">
                <Activity className="h-16 w-16 mx-auto mb-4 text-orange-300 opacity-50" />
                <h3 className="text-xl font-semibold text-white mb-2">Start Tracking EDS Symptoms</h3>
                <p className="text-cyan-200 mb-6">
                  Log joint pain, dislocations, and triggers to better understand patterns
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {edsSymptoms.map((symptom, idx) => (
                  <div
                    key={idx}
                    className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-bold text-white">{symptom.jointLocation}</span>
                          <span className="px-2 py-1 bg-orange-600/30 rounded-full text-xs">
                            Pain: {symptom.severity}/10
                          </span>
                          <span className="text-sm text-gray-300">{symptom.duration}</span>
                        </div>
                        {symptom.triggers && (
                          <p className="text-sm text-cyan-200">Triggers: {symptom.triggers}</p>
                        )}
                        {symptom.notes && (
                          <p className="text-sm text-gray-300 mt-2">{symptom.notes}</p>
                        )}
                      </div>
                      <span className="text-sm text-gray-400">{symptom.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Health Metrics View */}
        {view === 'metrics' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">📊 Health Metrics</h2>
              <button
                onClick={() => setShowAddMetric(true)}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Metric</span>
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {healthMetrics.length > 0 && (
                <>
                  <div className="bg-gradient-to-br from-red-600 to-pink-600 rounded-xl p-4 text-white">
                    <Heart className="h-6 w-6 mb-2 opacity-75" />
                    <p className="text-xs opacity-90 mb-1">Blood Pressure</p>
                    <p className="text-lg font-bold">
                      {healthMetrics[healthMetrics.length - 1].bloodPressure || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-4 text-white">
                    <Activity className="h-6 w-6 mb-2 opacity-75" />
                    <p className="text-xs opacity-90 mb-1">Heart Rate</p>
                    <p className="text-lg font-bold">
                      {healthMetrics[healthMetrics.length - 1].heartRate || 'N/A'} bpm
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-4 text-white">
                    <TrendingUp className="h-6 w-6 mb-2 opacity-75" />
                    <p className="text-xs opacity-90 mb-1">Weight</p>
                    <p className="text-lg font-bold">
                      {healthMetrics[healthMetrics.length - 1].weight || 'N/A'} lbs
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl p-4 text-white">
                    <Heart className="h-6 w-6 mb-2 opacity-75" />
                    <p className="text-xs opacity-90 mb-1">Glucose</p>
                    <p className="text-lg font-bold">
                      {healthMetrics[healthMetrics.length - 1].glucose || 'N/A'} mg/dL
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Calendar View */}
        {view === 'calendar' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 text-center">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-green-400" />
            <h3 className="text-2xl font-bold text-white mb-2">Calendar View</h3>
            <p className="text-cyan-200">
              Visual calendar of medication schedules, appointments, and health tracking coming soon!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default HealthTracker