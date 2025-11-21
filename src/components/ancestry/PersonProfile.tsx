import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, User, Calendar, MapPin, Award, BookOpen, Heart, Edit,
  Trash2, Image, FileText, MessageCircle, Dna, Globe, Save
} from 'lucide-react';
import { Ancestor, ancestryService } from '../../services/ancestryService';

interface PersonProfileProps {
  ancestor: Ancestor;
  onClose: () => void;
  onUpdate: () => void;
}

export default function PersonProfile({
  ancestor,
  onClose,
  onUpdate
}: PersonProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAncestor, setEditedAncestor] = useState(ancestor);
  const [activeTab, setActiveTab] = useState<'biography' | 'timeline' | 'stories' | 'documents'>('biography');

  const handleSave = async () => {
    await ancestryService.updateAncestor(ancestor.id, editedAncestor);
    setIsEditing(false);
    onUpdate();
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to remove ${ancestor.name} from your family tree?`)) {
      await ancestryService.deleteAncestor(ancestor.id);
      onClose();
      onUpdate();
    }
  };

  const calculateAge = () => {
    if (ancestor.birthYear && ancestor.deathYear) {
      return ancestor.deathYear - ancestor.birthYear;
    }
    return null;
  };

  const getEra = () => {
    if (!ancestor.birthYear) return 'Unknown Era';
    if (ancestor.birthYear >= 2000) return 'Contemporary';
    if (ancestor.birthYear >= 1960) return 'Modern Era';
    if (ancestor.birthYear >= 1920) return 'Early 20th Century';
    if (ancestor.birthYear >= 1850) return '19th Century';
    return 'Historical Era';
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-[#1A1520] to-[#0A0A0F] border border-amber-600/30 rounded-xl shadow-2xl overflow-hidden"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'paper\' x=\'0\' y=\'0\' width=\'100\' height=\'100\' patternUnits=\'userSpaceOnUse\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.03\' /%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100\' height=\'100\' fill=\'url(%23paper)\' /%3E%3C/svg%3E")',
          }}
        >
          {/* Header */}
          <div className="relative p-6 border-b border-amber-600/20">
            <div className="flex items-start gap-6">
              {/* Photo */}
              <div className="relative">
                {ancestor.photoUrl ? (
                  <img
                    src={ancestor.photoUrl}
                    alt={ancestor.name}
                    className="w-32 h-32 rounded-lg object-cover border-4 border-amber-600/30 sepia shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-amber-900/40 to-amber-700/20 border-4 border-amber-600/30 flex items-center justify-center shadow-lg">
                    <User className="w-16 h-16 text-amber-400/60" />
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full text-xs font-bold text-white shadow-lg">
                  Gen {ancestor.generation}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-amber-200 mb-2">{ancestor.name}</h2>
                <p className="text-lg text-[#C0C0D8]/80 mb-3">{ancestor.relation}</p>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  {ancestor.birthYear && (
                    <div className="flex items-center gap-2 text-[#C0C0D8]/70">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <span>
                        {ancestor.birthYear} - {ancestor.deathYear || 'Present'}
                        {calculateAge() && <span className="ml-1">({calculateAge()} years)</span>}
                      </span>
                    </div>
                  )}

                  {ancestor.birthPlace && (
                    <div className="flex items-center gap-2 text-[#C0C0D8]/70">
                      <MapPin className="w-4 h-4 text-amber-400" />
                      <span>{ancestor.birthPlace}</span>
                    </div>
                  )}

                  {ancestor.occupation && (
                    <div className="flex items-center gap-2 text-[#C0C0D8]/70">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>{ancestor.occupation}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-[#C0C0D8]/70">
                    <Globe className="w-4 h-4 text-amber-400" />
                    <span>{getEra()}</span>
                  </div>
                </div>

                {ancestor.culturalBackground && ancestor.culturalBackground.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {ancestor.culturalBackground.map((culture, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-amber-900/20 border border-amber-600/30 rounded-full text-xs text-amber-300"
                      >
                        {culture}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {!isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 bg-[#0A0A0F]/60 border border-amber-600/30 rounded-lg hover:border-amber-500/50 transition-all"
                      title="Edit"
                    >
                      <Edit className="w-5 h-5 text-amber-400" />
                    </button>
                    <button
                      onClick={handleDelete}
                      className="p-2 bg-[#0A0A0F]/60 border border-red-600/30 rounded-lg hover:border-red-500/50 transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5 text-red-400" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleSave}
                    className="p-2 bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg hover:from-amber-500 hover:to-amber-600 transition-all"
                    title="Save"
                  >
                    <Save className="w-5 h-5 text-white" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 bg-[#0A0A0F]/60 border border-amber-600/30 rounded-lg hover:border-amber-500/50 transition-all"
                  title="Close"
                >
                  <X className="w-5 h-5 text-amber-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-amber-600/20">
            <div className="flex gap-1 px-6">
              {[
                { id: 'biography' as const, icon: User, label: 'Biography' },
                { id: 'timeline' as const, icon: Calendar, label: 'Life Timeline' },
                { id: 'stories' as const, icon: BookOpen, label: 'Stories' },
                { id: 'documents' as const, icon: FileText, label: 'Documents' },
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
                    activeTab === id
                      ? 'border-amber-500 text-amber-300'
                      : 'border-transparent text-[#C0C0D8]/60 hover:text-[#C0C0D8]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <AnimatePresence mode="wait">
              {activeTab === 'biography' && (
                <motion.div
                  key="biography"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-amber-300 mb-2">Name</label>
                        <input
                          type="text"
                          value={editedAncestor.name}
                          onChange={(e) => setEditedAncestor({ ...editedAncestor, name: e.target.value })}
                          className="w-full bg-[#0A0A0F]/60 border border-amber-600/30 rounded-lg px-4 py-2 text-[#E8E8F4] focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-amber-300 mb-2">Birth Year</label>
                          <input
                            type="number"
                            value={editedAncestor.birthYear || ''}
                            onChange={(e) => setEditedAncestor({ ...editedAncestor, birthYear: parseInt(e.target.value) })}
                            className="w-full bg-[#0A0A0F]/60 border border-amber-600/30 rounded-lg px-4 py-2 text-[#E8E8F4] focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-amber-300 mb-2">Death Year</label>
                          <input
                            type="number"
                            value={editedAncestor.deathYear || ''}
                            onChange={(e) => setEditedAncestor({ ...editedAncestor, deathYear: parseInt(e.target.value) })}
                            className="w-full bg-[#0A0A0F]/60 border border-amber-600/30 rounded-lg px-4 py-2 text-[#E8E8F4] focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-amber-300 mb-2">Birth Place</label>
                        <input
                          type="text"
                          value={editedAncestor.birthPlace || ''}
                          onChange={(e) => setEditedAncestor({ ...editedAncestor, birthPlace: e.target.value })}
                          className="w-full bg-[#0A0A0F]/60 border border-amber-600/30 rounded-lg px-4 py-2 text-[#E8E8F4] focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-amber-300 mb-2">Occupation</label>
                        <input
                          type="text"
                          value={editedAncestor.occupation || ''}
                          onChange={(e) => setEditedAncestor({ ...editedAncestor, occupation: e.target.value })}
                          className="w-full bg-[#0A0A0F]/60 border border-amber-600/30 rounded-lg px-4 py-2 text-[#E8E8F4] focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-amber-300 mb-2">Relation</label>
                        <input
                          type="text"
                          value={editedAncestor.relation}
                          onChange={(e) => setEditedAncestor({ ...editedAncestor, relation: e.target.value })}
                          className="w-full bg-[#0A0A0F]/60 border border-amber-600/30 rounded-lg px-4 py-2 text-[#E8E8F4] focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-amber-300 mb-2">Generation</label>
                        <input
                          type="number"
                          value={editedAncestor.generation}
                          onChange={(e) => setEditedAncestor({ ...editedAncestor, generation: parseInt(e.target.value) })}
                          className="w-full bg-[#0A0A0F]/60 border border-amber-600/30 rounded-lg px-4 py-2 text-[#E8E8F4] focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Personal Details */}
                      <div className="bg-[#0A0A0F]/40 border border-amber-600/20 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-amber-200 mb-4 flex items-center gap-2">
                          <User className="w-5 h-5" />
                          Personal Details
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-[#C0C0D8]/60">Full Name:</span>
                            <p className="text-[#E8E8F4] font-medium">{ancestor.name}</p>
                          </div>
                          <div>
                            <span className="text-[#C0C0D8]/60">Relation:</span>
                            <p className="text-[#E8E8F4] font-medium">{ancestor.relation}</p>
                          </div>
                          <div>
                            <span className="text-[#C0C0D8]/60">Birth:</span>
                            <p className="text-[#E8E8F4] font-medium">
                              {ancestor.birthYear || 'Unknown'}
                              {ancestor.birthPlace && ` in ${ancestor.birthPlace}`}
                            </p>
                          </div>
                          <div>
                            <span className="text-[#C0C0D8]/60">Death:</span>
                            <p className="text-[#E8E8F4] font-medium">{ancestor.deathYear || 'Unknown'}</p>
                          </div>
                          {ancestor.occupation && (
                            <div className="col-span-2">
                              <span className="text-[#C0C0D8]/60">Occupation:</span>
                              <p className="text-[#E8E8F4] font-medium">{ancestor.occupation}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Cultural Heritage */}
                      {ancestor.culturalBackground && ancestor.culturalBackground.length > 0 && (
                        <div className="bg-[#0A0A0F]/40 border border-amber-600/20 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-amber-200 mb-4 flex items-center gap-2">
                            <Globe className="w-5 h-5" />
                            Cultural Heritage
                          </h3>
                          <div className="flex flex-wrap gap-3">
                            {ancestor.culturalBackground.map((culture, idx) => (
                              <div
                                key={idx}
                                className="px-4 py-2 bg-amber-900/20 border border-amber-600/30 rounded-lg"
                              >
                                <p className="text-amber-300 font-medium">{culture}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Personality */}
                      {ancestor.personality && (
                        <div className="bg-[#0A0A0F]/40 border border-amber-600/20 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-amber-200 mb-4 flex items-center gap-2">
                            <Heart className="w-5 h-5" />
                            Personality
                          </h3>
                          <p className="text-[#C0C0D8]/80">{ancestor.personality}</p>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'timeline' && (
                <motion.div
                  key="timeline"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="space-y-4">
                    {ancestor.birthYear && (
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full bg-amber-500" />
                          <div className="w-0.5 flex-1 bg-amber-500/30 mt-2" />
                        </div>
                        <div className="flex-1 pb-8">
                          <p className="text-amber-300 font-semibold mb-1">{ancestor.birthYear}</p>
                          <p className="text-[#C0C0D8]/80">
                            Born{ancestor.birthPlace && ` in ${ancestor.birthPlace}`}
                          </p>
                        </div>
                      </div>
                    )}

                    {ancestor.occupation && (
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full bg-amber-500" />
                          <div className="w-0.5 flex-1 bg-amber-500/30 mt-2" />
                        </div>
                        <div className="flex-1 pb-8">
                          <p className="text-amber-300 font-semibold mb-1">Life's Work</p>
                          <p className="text-[#C0C0D8]/80">Worked as a {ancestor.occupation}</p>
                        </div>
                      </div>
                    )}

                    {ancestor.deathYear && (
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full bg-amber-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-amber-300 font-semibold mb-1">{ancestor.deathYear}</p>
                          <p className="text-[#C0C0D8]/80">
                            Passed away{calculateAge() && ` at age ${calculateAge()}`}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'stories' && (
                <motion.div
                  key="stories"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {ancestor.stories && ancestor.stories.length > 0 ? (
                    <div className="space-y-4">
                      {ancestor.stories.map((story, idx) => (
                        <div
                          key={idx}
                          className="bg-[#0A0A0F]/40 border border-amber-600/20 rounded-lg p-4"
                        >
                          <div className="flex items-start gap-3">
                            <BookOpen className="w-5 h-5 text-amber-400 mt-1 flex-shrink-0" />
                            <p className="text-[#C0C0D8]/80 leading-relaxed">{story}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="w-12 h-12 text-amber-400/30 mx-auto mb-3" />
                      <p className="text-[#C0C0D8]/60">No stories recorded yet</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'documents' && (
                <motion.div
                  key="documents"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-amber-400/30 mx-auto mb-3" />
                    <p className="text-[#C0C0D8]/60 mb-4">No documents uploaded yet</p>
                    <button className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg hover:from-amber-500 hover:to-amber-600 transition-all">
                      Upload Documents
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-amber-600/20 bg-[#0A0A0F]/60">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-[#0A0A0F]/60 border border-amber-600/30 rounded-lg hover:border-amber-500/50 transition-all text-sm text-amber-300">
                  <MessageCircle className="w-4 h-4" />
                  Chat with {ancestor.name.split(' ')[0]}
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#0A0A0F]/60 border border-amber-600/30 rounded-lg hover:border-amber-500/50 transition-all text-sm text-amber-300">
                  <Dna className="w-4 h-4" />
                  View DNA Connection
                </button>
              </div>

              <p className="text-xs text-[#C0C0D8]/40">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
