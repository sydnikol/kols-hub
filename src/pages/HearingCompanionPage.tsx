import React, { useState } from 'react';
import { FileText, Calendar, Briefcase, Users, AlertCircle, CheckCircle, Clock, Folder, Download, Plus, Edit, Trash2, Search } from 'lucide-react';

export default function HearingCompanionPage() {
  const [activeTab, setActiveTab] = useState('cases');
  const [searchQuery, setSearchQuery] = useState('');

  const cases = [
    { id: '1', title: 'SSI Benefits Appeal', status: 'active', nextHearing: '2025-12-15', priority: 'high', evidence: 12, notes: 8 },
    { id: '2', title: 'Workplace Accommodation Review', status: 'pending', nextHearing: '2025-12-20', priority: 'medium', evidence: 6, notes: 4 },
    { id: '3', title: 'Housing Discrimination Case', status: 'preparation', nextHearing: '2026-01-10', priority: 'high', evidence: 15, notes: 12 }
  ];

  const scriptTemplates = [
    { id: '1', name: 'Benefits Appeal Opening Statement', category: 'SSI/SSDI', uses: 24 },
    { id: '2', name: 'Workplace Accommodation Request', category: 'Employment', uses: 18 },
    { id: '3', name: 'Medical Evidence Presentation', category: 'Healthcare', uses: 31 },
    { id: '4', name: 'Housing Rights Assertion', category: 'Housing', uses: 12 }
  ];

  const evidenceLibrary = [
    { id: '1', type: 'Medical Records', count: 45, lastAdded: '2 days ago' },
    { id: '2', type: 'Employment Documents', count: 23, lastAdded: '1 week ago' },
    { id: '3', type: 'Communication Logs', count: 67, lastAdded: '3 days ago' },
    { id: '4', type: 'Financial Records', count: 34, lastAdded: '5 days ago' }
  ];

  const upcomingHearings = [
    { date: 'Dec 15, 2025', time: '10:00 AM', case: 'SSI Benefits Appeal', type: 'Virtual', prepTime: '3 days' },
    { date: 'Dec 20, 2025', time: '2:00 PM', case: 'Workplace Accommodation', type: 'In-Person', prepTime: '8 days' },
    { date: 'Jan 10, 2026', time: '9:30 AM', case: 'Housing Discrimination', type: 'Virtual', prepTime: '28 days' }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'preparation': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-red-950 to-rose-950 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-400 mb-4">
          Hearing Companion
        </h1>
        <p className="text-rose-300 text-lg">Disability advocacy suite for case management, evidence, and scripts</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-red-900/40 border border-red-700/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Briefcase className="text-red-400" size={24} />
            <span className="text-2xl font-bold text-white">3</span>
          </div>
          <p className="text-rose-300">Active Cases</p>
        </div>
        <div className="bg-red-900/40 border border-red-700/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="text-red-400" size={24} />
            <span className="text-2xl font-bold text-white">3</span>
          </div>
          <p className="text-rose-300">Upcoming Hearings</p>
        </div>
        <div className="bg-red-900/40 border border-red-700/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <FileText className="text-red-400" size={24} />
            <span className="text-2xl font-bold text-white">169</span>
          </div>
          <p className="text-rose-300">Evidence Files</p>
        </div>
        <div className="bg-red-900/40 border border-red-700/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="text-red-400" size={24} />
            <span className="text-2xl font-bold text-white">2</span>
          </div>
          <p className="text-rose-300">Action Items</p>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {['cases', 'hearings', 'evidence', 'scripts', 'notes'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-red-600 text-white'
                : 'bg-red-900/40 text-rose-300 hover:bg-red-800/50'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Cases Tab */}
      {activeTab === 'cases' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">My Cases</h2>
            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors">
              <Plus size={20} />
              <span>New Case</span>
            </button>
          </div>

          <div className="space-y-4">
            {cases.map(caseItem => (
              <div key={caseItem.id} className="bg-red-900/40 border border-red-700/30 rounded-xl p-6 hover:bg-red-800/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{caseItem.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(caseItem.status)}`}>
                        {caseItem.status.toUpperCase()}
                      </span>
                      <AlertCircle className={getPriorityColor(caseItem.priority)} size={20} />
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-rose-300">
                      <div className="flex items-center space-x-2">
                        <Calendar size={14} />
                        <span>Next: {caseItem.nextHearing}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText size={14} />
                        <span>{caseItem.evidence} evidence files</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Edit size={14} />
                        <span>{caseItem.notes} notes</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-red-700/50 hover:bg-red-600/50 text-white px-4 py-2 rounded-lg transition-colors">
                      <Edit size={16} />
                    </button>
                    <button className="bg-red-700/50 hover:bg-red-600/50 text-white px-4 py-2 rounded-lg transition-colors">
                      <Folder size={16} />
                    </button>
                  </div>
                </div>
                <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                  View Full Case Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hearings Tab */}
      {activeTab === 'hearings' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white mb-6">Upcoming Hearings</h2>
          <div className="space-y-4">
            {upcomingHearings.map((hearing, idx) => (
              <div key={idx} className="bg-red-900/40 border border-red-700/30 rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{hearing.case}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-rose-300">
                      <div>
                        <span className="block text-xs text-rose-400 mb-1">Date</span>
                        <span>{hearing.date}</span>
                      </div>
                      <div>
                        <span className="block text-xs text-rose-400 mb-1">Time</span>
                        <span>{hearing.time}</span>
                      </div>
                      <div>
                        <span className="block text-xs text-rose-400 mb-1">Type</span>
                        <span>{hearing.type}</span>
                      </div>
                      <div>
                        <span className="block text-xs text-rose-400 mb-1">Prep Time Remaining</span>
                        <span>{hearing.prepTime}</span>
                      </div>
                    </div>
                  </div>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors">
                    Prepare
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Evidence Tab */}
      {activeTab === 'evidence' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Evidence Library</h2>
            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors">
              <Plus size={20} />
              <span>Upload Evidence</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {evidenceLibrary.map(category => (
              <div key={category.id} className="bg-red-900/40 border border-red-700/30 rounded-xl p-6 hover:bg-red-800/50 transition-all cursor-pointer">
                <Folder className="text-red-400 mb-4" size={32} />
                <h3 className="text-lg font-bold text-white mb-2">{category.type}</h3>
                <p className="text-2xl font-bold text-red-300 mb-2">{category.count} files</p>
                <p className="text-sm text-rose-400">Last added {category.lastAdded}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scripts Tab */}
      {activeTab === 'scripts' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Advocacy Script Templates</h2>
            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors">
              <Plus size={20} />
              <span>Create Custom Script</span>
            </button>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 text-rose-400" size={20} />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-red-900/40 border border-red-700/30 rounded-lg text-white placeholder-rose-400 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scriptTemplates.map(template => (
              <div key={template.id} className="bg-red-900/40 border border-red-700/30 rounded-xl p-6 hover:bg-red-800/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{template.name}</h3>
                    <span className="text-sm px-2 py-1 bg-red-500/20 text-red-300 rounded-full border border-red-500/30">
                      {template.category}
                    </span>
                  </div>
                  <span className="text-sm text-rose-400">{template.uses} uses</span>
                </div>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Use Template
                  </button>
                  <button className="bg-red-700/50 hover:bg-red-600/50 text-white px-4 py-2 rounded-lg transition-colors">
                    <Download size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes Tab */}
      {activeTab === 'notes' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Case Notes & Documentation</h2>
            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors">
              <Plus size={20} />
              <span>New Note</span>
            </button>
          </div>

          <div className="bg-red-900/40 border border-red-700/30 rounded-xl p-8">
            <div className="text-center text-rose-300">
              <FileText className="mx-auto mb-4 text-red-400" size={48} />
              <p className="text-lg">Create detailed case notes, track communications, and document important details for your advocacy efforts.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
