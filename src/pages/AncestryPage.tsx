import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TreePine, User, BookOpen, Heart, Dna, Upload, Plus,
  FileText, Image, Calendar, MapPin, MessageCircle,
  TrendingUp, Users, Sparkles, ChevronRight, Award,
  Search, Filter, Download, Globe
} from 'lucide-react';
import { ancestryService, Ancestor } from '../services/ancestryService';
import FamilyTreeVisualization from '../components/ancestry/FamilyTreeVisualization';
import AncestorChatbot from '../components/ancestry/AncestorChatbot';
import PersonProfile from '../components/ancestry/PersonProfile';
import { useAncestryData } from '../hooks/useAncestryData';

type ViewMode = 'tree' | 'grid' | 'timeline' | 'chat' | 'heritage' | 'documents' | 'health';

interface HeritageBreakdown {
  region: string;
  percentage: number;
  traditions: string[];
}

export default function AncestryPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('tree');
  const [selectedAncestor, setSelectedAncestor] = useState<Ancestor | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const { ancestors, loading, heritageData, familyHealth, refreshData } = useAncestryData();

  const filteredAncestors = ancestors.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.birthPlace?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.occupation?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalAncestors: ancestors.length,
    generations: Math.max(...ancestors.map(a => a.generation), 0),
    cultures: new Set(ancestors.flatMap(a => a.culturalBackground || [])).size,
    documentsCount: ancestors.reduce((acc, a) => acc + (a.stories?.length || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#1A1520] to-[#0A0A0F] text-[#E8E8F4]">
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-[#0A0A0F]/80 border-b border-[#C0C0D8]/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent mb-2">
                Family Heritage
              </h1>
              <p className="text-[#C0C0D8]/70">Explore your ancestral roots and family stories</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-900/30 to-amber-700/30 border border-amber-600/30 rounded-lg hover:border-amber-500/50 transition-all"
              >
                <Upload className="w-4 h-4" />
                Import GEDCOM
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg hover:from-amber-500 hover:to-amber-600 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Ancestor
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-amber-900/20 to-amber-800/10 border border-amber-600/20 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-amber-400" />
                <div>
                  <p className="text-2xl font-bold text-amber-300">{stats.totalAncestors}</p>
                  <p className="text-xs text-[#C0C0D8]/60">Ancestors</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-900/20 to-amber-800/10 border border-amber-600/20 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-amber-400" />
                <div>
                  <p className="text-2xl font-bold text-amber-300">{stats.generations}</p>
                  <p className="text-xs text-[#C0C0D8]/60">Generations</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-900/20 to-amber-800/10 border border-amber-600/20 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Globe className="w-8 h-8 text-amber-400" />
                <div>
                  <p className="text-2xl font-bold text-amber-300">{stats.cultures}</p>
                  <p className="text-xs text-[#C0C0D8]/60">Cultures</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-900/20 to-amber-800/10 border border-amber-600/20 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-amber-400" />
                <div>
                  <p className="text-2xl font-bold text-amber-300">{stats.documentsCount}</p>
                  <p className="text-xs text-[#C0C0D8]/60">Stories</p>
                </div>
              </div>
            </div>
          </div>

          {/* View Mode Tabs */}
          <div className="flex items-center gap-2">
            {[
              { mode: 'tree' as ViewMode, icon: TreePine, label: 'Family Tree' },
              { mode: 'grid' as ViewMode, icon: Users, label: 'All Ancestors' },
              { mode: 'chat' as ViewMode, icon: MessageCircle, label: 'Ancestor Chat' },
              { mode: 'heritage' as ViewMode, icon: Globe, label: 'Heritage' },
              { mode: 'health' as ViewMode, icon: Heart, label: 'Family Health' },
              { mode: 'documents' as ViewMode, icon: FileText, label: 'Documents' },
            ].map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  viewMode === mode
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white'
                    : 'bg-[#1A1A24]/60 text-[#C0C0D8]/70 hover:bg-[#1A1A24] hover:text-[#C0C0D8]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {viewMode === 'tree' && (
            <motion.div
              key="tree"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <FamilyTreeVisualization
                ancestors={ancestors}
                onSelectAncestor={setSelectedAncestor}
              />
            </motion.div>
          )}

          {viewMode === 'grid' && (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AncestorGrid
                ancestors={filteredAncestors}
                onSelectAncestor={setSelectedAncestor}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </motion.div>
          )}

          {viewMode === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AncestorChatbot ancestors={ancestors} />
            </motion.div>
          )}

          {viewMode === 'heritage' && (
            <motion.div
              key="heritage"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <HeritageView heritageData={heritageData} ancestors={ancestors} />
            </motion.div>
          )}

          {viewMode === 'health' && (
            <motion.div
              key="health"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <FamilyHealthView healthData={familyHealth} ancestors={ancestors} />
            </motion.div>
          )}

          {viewMode === 'documents' && (
            <motion.div
              key="documents"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <DocumentsLibrary ancestors={ancestors} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Person Profile Modal */}
      {selectedAncestor && (
        <PersonProfile
          ancestor={selectedAncestor}
          onClose={() => setSelectedAncestor(null)}
          onUpdate={refreshData}
        />
      )}
    </div>
  );
}

// Ancestor Grid Component
function AncestorGrid({
  ancestors,
  onSelectAncestor,
  searchQuery,
  onSearchChange
}: {
  ancestors: Ancestor[];
  onSelectAncestor: (ancestor: Ancestor) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}) {
  return (
    <div>
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C0C0D8]/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search ancestors by name, place, or occupation..."
            className="w-full bg-[#1A1A24]/60 border border-[#C0C0D8]/20 rounded-lg pl-12 pr-4 py-3 text-[#E8E8F4] placeholder-[#C0C0D8]/40 focus:outline-none focus:border-amber-500/50"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ancestors.map((ancestor) => (
          <motion.div
            key={ancestor.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => onSelectAncestor(ancestor)}
            className="bg-gradient-to-br from-[#1A1520]/80 to-[#0A0A0F]/60 border border-amber-600/20 rounded-lg p-6 cursor-pointer hover:border-amber-500/40 transition-all backdrop-blur-sm"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="paper" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.03" /%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100" height="100" fill="url(%23paper)" /%3E%3C/svg%3E")',
            }}
          >
            <div className="flex items-start gap-4 mb-4">
              {ancestor.photoUrl ? (
                <img
                  src={ancestor.photoUrl}
                  alt={ancestor.name}
                  className="w-16 h-16 rounded-lg object-cover border-2 border-amber-600/30 sepia"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-amber-900/40 to-amber-700/20 border-2 border-amber-600/30 flex items-center justify-center">
                  <User className="w-8 h-8 text-amber-400/60" />
                </div>
              )}

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-amber-200 mb-1">{ancestor.name}</h3>
                <p className="text-sm text-[#C0C0D8]/60">{ancestor.relation}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              {ancestor.birthYear && (
                <div className="flex items-center gap-2 text-[#C0C0D8]/70">
                  <Calendar className="w-4 h-4 text-amber-400/60" />
                  <span>
                    {ancestor.birthYear} - {ancestor.deathYear || 'Present'}
                    {ancestor.birthYear && ` (${ancestor.deathYear ? ancestor.deathYear - ancestor.birthYear : new Date().getFullYear() - ancestor.birthYear} years)`}
                  </span>
                </div>
              )}

              {ancestor.birthPlace && (
                <div className="flex items-center gap-2 text-[#C0C0D8]/70">
                  <MapPin className="w-4 h-4 text-amber-400/60" />
                  <span>{ancestor.birthPlace}</span>
                </div>
              )}

              {ancestor.occupation && (
                <div className="flex items-center gap-2 text-[#C0C0D8]/70">
                  <Award className="w-4 h-4 text-amber-400/60" />
                  <span>{ancestor.occupation}</span>
                </div>
              )}
            </div>

            {ancestor.culturalBackground && ancestor.culturalBackground.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {ancestor.culturalBackground.map((culture, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-amber-900/20 border border-amber-600/30 rounded text-xs text-amber-300"
                  >
                    {culture}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-amber-600/20 flex items-center justify-between">
              <span className="text-xs text-[#C0C0D8]/50">Generation {ancestor.generation}</span>
              <ChevronRight className="w-4 h-4 text-amber-400/60" />
            </div>
          </motion.div>
        ))}
      </div>

      {ancestors.length === 0 && (
        <div className="text-center py-16">
          <TreePine className="w-16 h-16 text-amber-400/30 mx-auto mb-4" />
          <p className="text-[#C0C0D8]/60">No ancestors found. Start building your family tree!</p>
        </div>
      )}
    </div>
  );
}

// Heritage View Component
function HeritageView({
  heritageData,
  ancestors
}: {
  heritageData: HeritageBreakdown[];
  ancestors: Ancestor[];
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Cultural Heritage Breakdown */}
      <div className="bg-gradient-to-br from-[#1A1520]/80 to-[#0A0A0F]/60 border border-amber-600/20 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-amber-200 mb-6 flex items-center gap-3">
          <Globe className="w-6 h-6" />
          Cultural Heritage
        </h2>

        <div className="space-y-4">
          {heritageData.map((heritage, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#E8E8F4]">{heritage.region}</span>
                <span className="text-amber-300 font-semibold">{heritage.percentage}%</span>
              </div>
              <div className="h-3 bg-[#0A0A0F]/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
                  style={{ width: `${heritage.percentage}%` }}
                />
              </div>
              {heritage.traditions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {heritage.traditions.map((tradition, tidx) => (
                    <span
                      key={tidx}
                      className="text-xs px-2 py-1 bg-amber-900/20 border border-amber-600/30 rounded text-amber-300"
                    >
                      {tradition}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Migration Patterns */}
      <div className="bg-gradient-to-br from-[#1A1520]/80 to-[#0A0A0F]/60 border border-amber-600/20 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-amber-200 mb-6 flex items-center gap-3">
          <MapPin className="w-6 h-6" />
          Migration Patterns
        </h2>

        <div className="space-y-4">
          {ancestors
            .filter(a => a.birthPlace)
            .map((ancestor, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-3 bg-[#0A0A0F]/40 border border-amber-600/20 rounded-lg"
              >
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <div className="flex-1">
                  <p className="text-[#E8E8F4] font-medium">{ancestor.name}</p>
                  <p className="text-sm text-[#C0C0D8]/60">{ancestor.birthPlace}</p>
                </div>
                <span className="text-sm text-amber-300">Gen {ancestor.generation}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Cultural Practices */}
      <div className="lg:col-span-2 bg-gradient-to-br from-[#1A1520]/80 to-[#0A0A0F]/60 border border-amber-600/20 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-amber-200 mb-6 flex items-center gap-3">
          <Sparkles className="w-6 h-6" />
          Cultural Practices & Traditions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-[#0A0A0F]/40 border border-amber-600/20 rounded-lg">
            <h3 className="text-amber-300 font-semibold mb-3">Celebrations</h3>
            <ul className="space-y-2 text-sm text-[#C0C0D8]/80">
              <li>Traditional family gatherings</li>
              <li>Cultural festivals</li>
              <li>Religious observances</li>
            </ul>
          </div>

          <div className="p-4 bg-[#0A0A0F]/40 border border-amber-600/20 rounded-lg">
            <h3 className="text-amber-300 font-semibold mb-3">Family Recipes</h3>
            <ul className="space-y-2 text-sm text-[#C0C0D8]/80">
              <li>Grandmother's special dishes</li>
              <li>Holiday traditions</li>
              <li>Cultural cuisine</li>
            </ul>
          </div>

          <div className="p-4 bg-[#0A0A0F]/40 border border-amber-600/20 rounded-lg">
            <h3 className="text-amber-300 font-semibold mb-3">Languages</h3>
            <ul className="space-y-2 text-sm text-[#C0C0D8]/80">
              <li>Ancestral languages</li>
              <li>Regional dialects</li>
              <li>Cultural phrases</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Family Health View Component
function FamilyHealthView({
  healthData,
  ancestors
}: {
  healthData: any;
  ancestors: Ancestor[];
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Genetic Health Markers */}
      <div className="bg-gradient-to-br from-[#1A1520]/80 to-[#0A0A0F]/60 border border-amber-600/20 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-amber-200 mb-6 flex items-center gap-3">
          <Dna className="w-6 h-6" />
          Genetic Health Insights
        </h2>

        <div className="space-y-4">
          <div className="p-4 bg-[#0A0A0F]/40 border border-amber-600/20 rounded-lg">
            <h3 className="text-amber-300 font-semibold mb-2">Common Family Traits</h3>
            <ul className="space-y-2 text-sm text-[#C0C0D8]/80">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                Longevity patterns detected
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                Strong cardiovascular health
              </li>
            </ul>
          </div>

          <div className="p-4 bg-[#0A0A0F]/40 border border-amber-600/20 rounded-lg">
            <h3 className="text-amber-300 font-semibold mb-2">Health Predispositions</h3>
            <p className="text-sm text-[#C0C0D8]/70 mb-3">
              Understanding family health history helps with preventive care
            </p>
            <button className="w-full px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg hover:from-amber-500 hover:to-amber-600 transition-all text-sm">
              Connect to Health Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Longevity Timeline */}
      <div className="bg-gradient-to-br from-[#1A1520]/80 to-[#0A0A0F]/60 border border-amber-600/20 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-amber-200 mb-6 flex items-center gap-3">
          <TrendingUp className="w-6 h-6" />
          Longevity Timeline
        </h2>

        <div className="space-y-3">
          {ancestors
            .filter(a => a.birthYear && a.deathYear)
            .map((ancestor, idx) => {
              const lifespan = ancestor.deathYear! - ancestor.birthYear!;
              return (
                <div key={idx} className="p-3 bg-[#0A0A0F]/40 border border-amber-600/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#E8E8F4]">{ancestor.name}</span>
                    <span className="text-amber-300 font-semibold">{lifespan} years</span>
                  </div>
                  <div className="h-2 bg-[#0A0A0F]/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
                      style={{ width: `${Math.min((lifespan / 100) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

// Documents Library Component
function DocumentsLibrary({ ancestors }: { ancestors: Ancestor[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Document Categories */}
      <div className="bg-gradient-to-br from-[#1A1520]/80 to-[#0A0A0F]/60 border border-amber-600/20 rounded-lg p-6">
        <h3 className="text-xl font-bold text-amber-200 mb-4">Categories</h3>
        <div className="space-y-2">
          {[
            { label: 'Birth Certificates', icon: FileText, count: 12 },
            { label: 'Photos', icon: Image, count: 48 },
            { label: 'Letters', icon: BookOpen, count: 23 },
            { label: 'Stories', icon: Sparkles, count: ancestors.reduce((acc, a) => acc + (a.stories?.length || 0), 0) }
          ].map(({ label, icon: Icon, count }) => (
            <button
              key={label}
              className="w-full flex items-center justify-between p-3 bg-[#0A0A0F]/40 border border-amber-600/20 rounded-lg hover:border-amber-500/40 transition-all"
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-amber-400" />
                <span className="text-[#E8E8F4]">{label}</span>
              </div>
              <span className="text-amber-300 font-semibold">{count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Documents */}
      <div className="lg:col-span-2 bg-gradient-to-br from-[#1A1520]/80 to-[#0A0A0F]/60 border border-amber-600/20 rounded-lg p-6">
        <h3 className="text-xl font-bold text-amber-200 mb-4">Recent Stories</h3>
        <div className="space-y-4">
          {ancestors
            .filter(a => a.stories && a.stories.length > 0)
            .slice(0, 5)
            .map((ancestor, idx) => (
              <div
                key={idx}
                className="p-4 bg-[#0A0A0F]/40 border border-amber-600/20 rounded-lg hover:border-amber-500/40 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-900/40 to-amber-700/20 border border-amber-600/30 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-amber-400/60" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-amber-200 font-semibold mb-1">{ancestor.name}'s Story</h4>
                    <p className="text-sm text-[#C0C0D8]/70 line-clamp-2">
                      {ancestor.stories![0]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
