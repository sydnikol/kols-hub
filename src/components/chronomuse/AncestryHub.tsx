import { motion } from 'framer-motion';
import { X, Upload, UserPlus, Users, MapPin, Briefcase, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ancestryService, Ancestor } from '../../services/ancestryService';

interface AncestryHubProps {
  onClose: () => void;
}

export default function AncestryHub({ onClose }: AncestryHubProps) {
  const [ancestors, setAncestors] = useState<Ancestor[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAncestor, setNewAncestor] = useState<Partial<Ancestor>>({
    name: '',
    relation: '',
    generation: 1,
  });

  useEffect(() => {
    loadAncestors();
  }, []);

  const loadAncestors = async () => {
    const loaded = await ancestryService.getAncestors();
    setAncestors(loaded);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imported = await ancestryService.importGEDCOM(file);
      setAncestors(imported);
      alert(`Successfully imported ${imported.length} ancestors!`);
    } catch (error) {
      alert('Failed to import GEDCOM file. Please check the file format.');
      console.error(error);
    }
  };

  const handleAddAncestor = async () => {
    if (!newAncestor.name || !newAncestor.relation) {
      alert('Please fill in at least name and relation');
      return;
    }

    try {
      await ancestryService.addAncestor(newAncestor as Omit<Ancestor, 'id'>);
      setNewAncestor({ name: '', relation: '', generation: 1 });
      setShowAddForm(false);
      await loadAncestors();
    } catch (error) {
      alert('Failed to add ancestor');
      console.error(error);
    }
  };

  const handleDeleteAncestor = async (id: string) => {
    if (confirm('Are you sure you want to remove this ancestor?')) {
      await ancestryService.deleteAncestor(id);
      await loadAncestors();
    }
  };

  return (
    <motion.div
      className="bg-[#0A0A0F]/95 backdrop-blur-xl rounded-3xl p-8 max-w-5xl w-full max-h-[85vh] overflow-hidden flex flex-col border border-[#C0C0D8]/30"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-[#C0C0D8] mb-2">🌳 Ancestry Hub</h2>
          <p className="text-sm text-[#E8E8F4]/60">
            Import your family tree and summon your ancestors
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-[#1A1A24]/60 hover:bg-[#1A1A24] flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5 text-[#C0C0D8]" />
        </button>
      </div>

      {/* Import Options */}
      <div className="flex gap-3 mb-6">
        <label className="flex-1 cursor-pointer">
          <input
            type="file"
            accept=".ged,.gedcom"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="px-4 py-3 bg-gradient-to-br from-[#4A5DB8] to-purple-600 hover:from-[#4A5DB8]/80 hover:to-purple-600/80 rounded-xl text-white font-medium transition-all flex items-center justify-center gap-2">
            <Upload className="w-4 h-4" />
            Import GEDCOM File
          </div>
        </label>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-3 bg-[#1A1A24]/60 hover:bg-[#1A1A24] rounded-xl text-[#C0C0D8] font-medium transition-all flex items-center gap-2 border border-[#C0C0D8]/20"
        >
          <UserPlus className="w-4 h-4" />
          Add Manually
        </button>
      </div>

      {/* Add Ancestor Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-[#1A1A24]/40 rounded-2xl p-6 mb-6 border border-[#C0C0D8]/20"
        >
          <h3 className="text-lg font-semibold text-[#C0C0D8] mb-4">Add New Ancestor</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name *"
              value={newAncestor.name || ''}
              onChange={(e) => setNewAncestor({ ...newAncestor, name: e.target.value })}
              className="px-4 py-2 bg-[#0A0A0F]/60 border border-[#C0C0D8]/30 rounded-xl text-[#C0C0D8] placeholder-[#C0C0D8]/40 focus:outline-none focus:border-purple-500"
            />
            <input
              type="text"
              placeholder="Relation (e.g., Grandmother) *"
              value={newAncestor.relation || ''}
              onChange={(e) => setNewAncestor({ ...newAncestor, relation: e.target.value })}
              className="px-4 py-2 bg-[#0A0A0F]/60 border border-[#C0C0D8]/30 rounded-xl text-[#C0C0D8] placeholder-[#C0C0D8]/40 focus:outline-none focus:border-purple-500"
            />
            <input
              type="number"
              placeholder="Birth Year"
              value={newAncestor.birthYear || ''}
              onChange={(e) => setNewAncestor({ ...newAncestor, birthYear: parseInt(e.target.value) || undefined })}
              className="px-4 py-2 bg-[#0A0A0F]/60 border border-[#C0C0D8]/30 rounded-xl text-[#C0C0D8] placeholder-[#C0C0D8]/40 focus:outline-none focus:border-purple-500"
            />
            <input
              type="text"
              placeholder="Birth Place"
              value={newAncestor.birthPlace || ''}
              onChange={(e) => setNewAncestor({ ...newAncestor, birthPlace: e.target.value })}
              className="px-4 py-2 bg-[#0A0A0F]/60 border border-[#C0C0D8]/30 rounded-xl text-[#C0C0D8] placeholder-[#C0C0D8]/40 focus:outline-none focus:border-purple-500"
            />
            <input
              type="text"
              placeholder="Occupation"
              value={newAncestor.occupation || ''}
              onChange={(e) => setNewAncestor({ ...newAncestor, occupation: e.target.value })}
              className="px-4 py-2 bg-[#0A0A0F]/60 border border-[#C0C0D8]/30 rounded-xl text-[#C0C0D8] placeholder-[#C0C0D8]/40 focus:outline-none focus:border-purple-500"
            />
            <select
              value={newAncestor.generation || 1}
              onChange={(e) => setNewAncestor({ ...newAncestor, generation: parseInt(e.target.value) })}
              className="px-4 py-2 bg-[#0A0A0F]/60 border border-[#C0C0D8]/30 rounded-xl text-[#C0C0D8] focus:outline-none focus:border-purple-500"
            >
              <option value={1}>Parents (1st gen)</option>
              <option value={2}>Grandparents (2nd gen)</option>
              <option value={3}>Great-grandparents (3rd gen)</option>
              <option value={4}>2x Great-grandparents (4th gen)</option>
              <option value={5}>3x Great-grandparents (5th gen)</option>
              <option value={6}>Earlier (6+ gen)</option>
            </select>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleAddAncestor}
              className="px-6 py-2 bg-gradient-to-br from-[#4A5DB8] to-purple-600 hover:from-[#4A5DB8]/80 hover:to-purple-600/80 rounded-xl text-white font-medium transition-all"
            >
              Add Ancestor
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-6 py-2 bg-[#1A1A24]/60 hover:bg-[#1A1A24] rounded-xl text-[#C0C0D8] font-medium transition-all"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Ancestors List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {ancestors.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-[#C0C0D8]/30 mx-auto mb-4" />
            <p className="text-[#C0C0D8]/60 mb-2">No ancestors yet</p>
            <p className="text-sm text-[#C0C0D8]/40">
              Import a GEDCOM file from Ancestry.com or add them manually
            </p>
          </div>
        ) : (
          ancestors.map((ancestor) => (
            <motion.div
              key={ancestor.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1A1A24]/60 rounded-2xl p-5 border border-[#C0C0D8]/20 hover:border-[#4A5DB8]/40 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-[#C0C0D8]">{ancestor.name}</h3>
                    <span className="px-3 py-1 bg-[#4A5DB8]/20 rounded-full text-xs text-[#4A5DB8]">
                      {ancestor.relation}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm text-[#E8E8F4]/70">
                    {ancestor.birthYear && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {ancestor.birthYear}
                          {ancestor.deathYear && ` - ${ancestor.deathYear}`}
                        </span>
                      </div>
                    )}
                    {ancestor.birthPlace && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{ancestor.birthPlace}</span>
                      </div>
                    )}
                    {ancestor.occupation && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        <span>{ancestor.occupation}</span>
                      </div>
                    )}
                  </div>

                  {ancestor.personality && (
                    <p className="mt-3 text-sm text-[#C0C0D8]/60 italic">
                      "{ancestor.personality}"
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteAncestor(ancestor.id)}
                  className="ml-4 w-8 h-8 rounded-full bg-red-900/20 hover:bg-red-900/40 flex items-center justify-center transition-colors"
                  title="Remove ancestor"
                >
                  <X className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Footer Note */}
      <div className="mt-6 pt-4 border-t border-[#C0C0D8]/20">
        <p className="text-xs text-[#C0C0D8]/50 text-center">
          💡 Tip: Export your tree from Ancestry.com as a GEDCOM file, then import it here.
          Your ancestors will appear in the NPC Summoner!
        </p>
      </div>
    </motion.div>
  );
}
