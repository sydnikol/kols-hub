import React, { useState } from 'react';
import { Palette, BookOpen, Music, Lightbulb, Activity } from 'lucide-react';
import WritingJournal from '../components/creative-arts/WritingJournal';
import ArtPortfolio from '../components/creative-arts/ArtPortfolio';
import MusicPractice from '../components/creative-arts/MusicPractice';
import CreativeIdeas from '../components/creative-arts/CreativeIdeas';

type TabType = 'overview' | 'writing' | 'art' | 'music' | 'ideas';

const CreativeArtsDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs: Array<{ id: TabType; label: string; icon: any; color: string }> = [
    { id: 'overview', label: 'Overview', icon: Activity, color: 'purple' },
    { id: 'writing', label: 'Writing', icon: BookOpen, color: 'purple' },
    { id: 'art', label: 'Art', icon: Palette, color: 'violet' },
    { id: 'music', label: 'Music', icon: Music, color: 'indigo' },
    { id: 'ideas', label: 'Ideas', icon: Lightbulb, color: 'purple' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-violet-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Palette className="w-8 h-8 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
              Creative Arts Hub
            </h1>
          </div>
          <p className="text-purple-400">
            Express yourself through writing, art, and music
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-purple-900/20 p-2 rounded-xl border border-purple-500/30 mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                      : 'bg-purple-900/20 text-purple-400 hover:bg-purple-500/20'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="animate-fadeIn">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tabs.slice(1).map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 p-6 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all text-left"
                    >
                      <Icon className="w-8 h-8 text-purple-400 mb-3" />
                      <h3 className="text-xl font-bold text-white mb-2">{tab.label}</h3>
                      <p className="text-purple-200/70 text-sm">
                        {tab.id === 'writing' && 'Track your writing projects and word counts'}
                        {tab.id === 'art' && 'Manage your art projects and practice sessions'}
                        {tab.id === 'music' && 'Log music practice and track progress'}
                        {tab.id === 'ideas' && 'Capture creative inspiration and ideas'}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="bg-purple-900/20 p-6 rounded-xl border border-purple-500/30">
                <h3 className="text-xl font-bold text-purple-300 mb-3">About Creative Arts Hub</h3>
                <p className="text-purple-200 mb-3">
                  Your creative practice matters. This hub helps you track your artistic journey across multiple mediums,
                  celebrate progress, and keep inspiration flowing.
                </p>
                <p className="text-purple-100 font-semibold">
                  Whether you write, paint, play music, or dream - your creativity deserves space and attention.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'writing' && <WritingJournal />}
          {activeTab === 'art' && <ArtPortfolio />}
          {activeTab === 'music' && <MusicPractice />}
          {activeTab === 'ideas' && <CreativeIdeas />}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CreativeArtsDashboardPage;
