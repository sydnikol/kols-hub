import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, MapPin, Trash2, Calendar, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

interface PainPoint {
  id: string;
  location: string;
  x: number; // percentage
  y: number; // percentage
  intensity: number; // 1-10
  type: string; // sharp, dull, burning, etc.
  timestamp: number;
  notes?: string;
}

const bodyParts = [
  'Head', 'Neck', 'Shoulders', 'Upper Back', 'Lower Back',
  'Chest', 'Abdomen', 'Hips', 'Left Arm', 'Right Arm',
  'Left Hand', 'Right Hand', 'Left Leg', 'Right Leg',
  'Left Knee', 'Right Knee', 'Left Foot', 'Right Foot',
];

const painTypes = [
  'Sharp', 'Dull', 'Burning', 'Throbbing', 'Stabbing',
  'Aching', 'Tingling', 'Numb', 'Cramping', 'Shooting',
];

const PainMap: React.FC = () => {
  const [painPoints, setPainPoints] = useState<PainPoint[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [intensity, setIntensity] = useState<number>(5);
  const [painType, setPainType] = useState<string>('Aching');
  const [notes, setNotes] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('pain-map-data');
    if (stored) {
      const data = JSON.parse(stored);
      setPainPoints(data.painPoints || []);
    }
  }, []);

  // Save to localStorage
  const saveData = (points: PainPoint[]) => {
    localStorage.setItem('pain-map-data', JSON.stringify({
      painPoints: points,
      lastUpdated: Date.now(),
    }));
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setClickPosition({ x, y });
    setShowForm(true);
  };

  const addPainPoint = () => {
    if (!selectedLocation) {
      toast.error('Please select a body location');
      return;
    }

    const newPoint: PainPoint = {
      id: `pain_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      location: selectedLocation,
      x: clickPosition?.x || Math.random() * 100,
      y: clickPosition?.y || Math.random() * 100,
      intensity,
      type: painType,
      timestamp: Date.now(),
      notes,
    };

    const newPoints = [...painPoints, newPoint];
    setPainPoints(newPoints);
    saveData(newPoints);
    setShowForm(false);
    setSelectedLocation('');
    setNotes('');
    setClickPosition(null);
    toast.success(`Pain point added: ${selectedLocation}`);
  };

  const removePainPoint = (id: string) => {
    const newPoints = painPoints.filter(p => p.id !== id);
    setPainPoints(newPoints);
    saveData(newPoints);
    toast.success('Pain point removed');
  };

  const clearAllPain = () => {
    setPainPoints([]);
    saveData([]);
    toast.success('All pain points cleared');
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 3) return 'bg-yellow-500';
    if (intensity <= 6) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getTodayPain = () => {
    const today = new Date().toDateString();
    return painPoints.filter(p => new Date(p.timestamp).toDateString() === today);
  };

  const avgIntensity = painPoints.length > 0
    ? (painPoints.reduce((sum, p) => sum + p.intensity, 0) / painPoints.length).toFixed(1)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-red-900/30 to-pink-900/30 p-6 rounded-xl border border-red-500/30"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-red-400" />
          <h2 className="text-2xl font-bold text-white">Pain Map</h2>
        </div>
        <button
          onClick={clearAllPain}
          className="text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-black/40 p-3 rounded-lg border border-red-500/20 text-center">
          <div className="text-red-400 text-xs mb-1">Active Points</div>
          <div className="text-2xl font-bold text-white">{painPoints.length}</div>
        </div>
        <div className="bg-black/40 p-3 rounded-lg border border-red-500/20 text-center">
          <div className="text-red-400 text-xs mb-1">Avg Intensity</div>
          <div className="text-2xl font-bold text-white">{avgIntensity}/10</div>
        </div>
        <div className="bg-black/40 p-3 rounded-lg border border-red-500/20 text-center">
          <div className="text-red-400 text-xs mb-1">Today</div>
          <div className="text-2xl font-bold text-white">{getTodayPain().length}</div>
        </div>
      </div>

      {/* Body Map */}
      <div className="bg-black/60 rounded-xl border-2 border-red-500/30 p-4 mb-6">
        <div className="text-center mb-3">
          <p className="text-red-300 text-sm font-semibold">
            Click on the body area where you feel pain
          </p>
        </div>

        {/* Simple Body Outline */}
        <div
          className="relative w-full aspect-[2/3] max-w-md mx-auto bg-gradient-to-b from-red-900/10 to-pink-900/10 rounded-lg cursor-crosshair border-2 border-dashed border-red-500/20"
          onClick={handleMapClick}
        >
          {/* Body Outline SVG */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 200 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Head */}
            <circle cx="100" cy="30" r="25" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="2" />

            {/* Torso */}
            <rect x="70" y="60" width="60" height="80" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="2" rx="10" />

            {/* Arms */}
            <line x1="70" y1="70" x2="30" y2="110" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="2" />
            <line x1="130" y1="70" x2="170" y2="110" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="2" />
            <line x1="30" y1="110" x2="30" y2="150" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="2" />
            <line x1="170" y1="110" x2="170" y2="150" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="2" />

            {/* Legs */}
            <line x1="85" y1="140" x2="85" y2="240" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="2" />
            <line x1="115" y1="140" x2="115" y2="240" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="2" />

            {/* Knees */}
            <circle cx="85" cy="190" r="8" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="2" />
            <circle cx="115" cy="190" r="8" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="2" />

            {/* Feet */}
            <ellipse cx="85" cy="270" rx="15" ry="10" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="2" />
            <ellipse cx="115" cy="270" rx="15" ry="10" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="2" />
          </svg>

          {/* Pain Points */}
          <AnimatePresence>
            {painPoints.map((point) => (
              <motion.div
                key={point.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
                onClick={(e) => {
                  e.stopPropagation();
                  removePainPoint(point.id);
                }}
              >
                <div
                  className={`w-6 h-6 rounded-full ${getIntensityColor(point.intensity)} animate-pulse border-2 border-white shadow-lg`}
                />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                  <div className="bg-black/90 text-white text-xs px-3 py-2 rounded whitespace-nowrap">
                    <div className="font-bold">{point.location}</div>
                    <div>{point.type} - {point.intensity}/10</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-yellow-300">Mild (1-3)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-orange-300">Moderate (4-6)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-red-300">Severe (7-10)</span>
          </div>
        </div>
      </div>

      {/* Add Pain Form */}
      {showForm && (
        <div className="bg-black/60 p-4 rounded-lg border border-red-500/30 mb-6">
          <h3 className="text-red-300 text-sm font-bold mb-4">Add Pain Point</h3>

          <div className="space-y-3">
            {/* Location */}
            <div>
              <label className="block text-red-300 text-sm font-semibold mb-2">
                Body Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-black/40 border border-red-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500/60"
              >
                <option value="">Select location...</option>
                {bodyParts.map((part) => (
                  <option key={part} value={part}>{part}</option>
                ))}
              </select>
            </div>

            {/* Intensity */}
            <div>
              <label className="block text-red-300 text-sm font-semibold mb-2">
                Pain Intensity: {intensity}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={(e) => setIntensity(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-red-300 text-sm font-semibold mb-2">
                Pain Type
              </label>
              <select
                value={painType}
                onChange={(e) => setPainType(e.target.value)}
                className="w-full bg-black/40 border border-red-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500/60"
              >
                {painTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-red-300 text-sm font-semibold mb-2">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-black/40 border border-red-500/30 rounded-lg px-4 py-2 text-white placeholder-red-400/50 focus:outline-none focus:border-red-500/60"
                placeholder="What triggered this pain?"
                rows={2}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={addPainPoint}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Add Pain Point
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-lg transition-colors mb-6 flex items-center justify-center gap-2"
        >
          <MapPin className="w-5 h-5" />
          Add Pain Point
        </button>
      )}

      {/* Pain Points List */}
      <div className="bg-black/40 p-4 rounded-lg border border-red-500/20">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-red-400" />
          <h3 className="text-red-300 text-sm font-semibold">Active Pain Points</h3>
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {painPoints.length > 0 ? (
            painPoints.slice().reverse().map((point) => (
              <div
                key={point.id}
                className="flex items-start gap-3 bg-red-900/20 p-3 rounded"
              >
                <div className={`w-4 h-4 rounded-full ${getIntensityColor(point.intensity)} flex-shrink-0 mt-1`} />
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold text-sm">{point.location}</div>
                  <div className="text-red-400 text-xs">
                    {point.type} • Intensity: {point.intensity}/10
                  </div>
                  {point.notes && (
                    <div className="text-red-300/70 text-xs mt-1">{point.notes}</div>
                  )}
                  <div className="text-red-400/50 text-xs mt-1">
                    {new Date(point.timestamp).toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => removePainPoint(point.id)}
                  className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center text-red-400 text-sm py-8">
              <AlertTriangle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No pain points logged.</p>
              <p className="text-xs mt-1">Click on the body map or "Add Pain Point" to track pain.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PainMap;
