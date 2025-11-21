import React, { useState, useEffect } from 'react';
import {
  Dices, Book, Scroll, Swords, Users, Map, Sparkles,
  Shield, Heart, Zap, Plus, Settings, RefreshCw, Download,
  Upload, Save, Eye, Edit, Trash2, Search, Filter
} from 'lucide-react';
import type { Character } from './types';
import CharacterSheet from './CharacterSheet';
import DiceRoller from './DiceRoller';
import SpellBook from './SpellBook';
import MonsterManual from './MonsterManual';
import CampaignManager from './CampaignManager';
import InitiativeTracker from './InitiativeTracker';
import ItemDatabase from './ItemDatabase';
import HomebrewCreator from './HomebrewCreator';
import SessionNotes from './SessionNotes';

interface Campaign {
  id: string;
  name: string;
  description: string;
  dm: string;
  players: string[];
  sessions: number;
  lastSession?: Date;
  level: string;
  setting: string;
}

const DnDBeyondHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load data from IndexedDB
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedCharacters = localStorage.getItem('dnd_characters');
        const savedCampaigns = localStorage.getItem('dnd_campaigns');
        
        if (savedCharacters) setCharacters(JSON.parse(savedCharacters));
        if (savedCampaigns) setCampaigns(JSON.parse(savedCampaigns));
      } catch (error) {
        console.error('Failed to load D&D data:', error);
      }
    };
    loadData();
  }, []);

  // Save data to IndexedDB
  useEffect(() => {
    localStorage.setItem('dnd_characters', JSON.stringify(characters));
  }, [characters]);

  useEffect(() => {
    localStorage.setItem('dnd_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Book },
    { id: 'characters', name: 'Characters', icon: Users },
    { id: 'dice', name: 'Dice Roller', icon: Dices },
    { id: 'spells', name: 'Spell Book', icon: Sparkles },
    { id: 'monsters', name: 'Monsters', icon: Swords },
    { id: 'campaigns', name: 'Campaigns', icon: Map },
    { id: 'initiative', name: 'Initiative', icon: Zap },
    { id: 'items', name: 'Items', icon: Shield },
    { id: 'homebrew', name: 'Homebrew', icon: Edit },
    { id: 'sessions', name: 'Session Notes', icon: Scroll }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Characters */}
            <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-purple-300 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Your Characters
                </h3>
                <button
                  onClick={() => setActiveTab('characters')}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {characters.slice(0, 3).map((char) => (
                  <div
                    key={char.id}
                    className="bg-purple-800/20 rounded-lg p-4 hover:bg-purple-800/30 transition-all cursor-pointer"
                    onClick={() => {
                      setSelectedCharacter(char);
                      setActiveTab('characters');
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-purple-200">{char.name}</h4>
                        <p className="text-sm text-purple-400">
                          Level {char.level} {char.class} • {char.race}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-purple-300">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">{char.hp.current}/{char.hp.max}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {characters.length === 0 && (
                  <div className="text-center py-8 text-purple-400">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No characters yet. Create your first character!</p>
                  </div>
                )}
              </div>
            </div>
            {/* Active Campaigns */}
            <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-purple-300 flex items-center gap-2">
                  <Map className="w-5 h-5" />
                  Active Campaigns
                </h3>
                <button
                  onClick={() => setActiveTab('campaigns')}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {campaigns.slice(0, 3).map((campaign) => (
                  <div
                    key={campaign.id}
                    className="bg-purple-800/20 rounded-lg p-4 hover:bg-purple-800/30 transition-all cursor-pointer"
                    onClick={() => {
                      setSelectedCampaign(campaign);
                      setActiveTab('campaigns');
                    }}
                  >
                    <h4 className="font-semibold text-purple-200">{campaign.name}</h4>
                    <p className="text-sm text-purple-400 mt-1">{campaign.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-purple-400">
                      <span>{campaign.sessions} Sessions</span>
                      <span>Level {campaign.level}</span>
                      <span>{campaign.players.length} Players</span>
                    </div>
                  </div>
                ))}
                {campaigns.length === 0 && (
                  <div className="text-center py-8 text-purple-400">
                    <Map className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No campaigns yet. Start your first adventure!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 lg:col-span-2">
              <h3 className="text-xl font-bold text-purple-300 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveTab('dice')}
                  className="bg-purple-800/30 hover:bg-purple-800/50 rounded-lg p-4 transition-all border border-purple-500/20 flex flex-col items-center gap-2"
                >
                  <Dices className="w-8 h-8 text-purple-400" />
                  <span className="text-sm text-purple-200">Roll Dice</span>
                </button>
                <button
                  onClick={() => setActiveTab('spells')}
                  className="bg-purple-800/30 hover:bg-purple-800/50 rounded-lg p-4 transition-all border border-purple-500/20 flex flex-col items-center gap-2"
                >
                  <Sparkles className="w-8 h-8 text-purple-400" />
                  <span className="text-sm text-purple-200">Spell Book</span>
                </button>
                <button
                  onClick={() => setActiveTab('initiative')}
                  className="bg-purple-800/30 hover:bg-purple-800/50 rounded-lg p-4 transition-all border border-purple-500/20 flex flex-col items-center gap-2"
                >
                  <Zap className="w-8 h-8 text-purple-400" />
                  <span className="text-sm text-purple-200">Initiative</span>
                </button>
                <button
                  onClick={() => setActiveTab('sessions')}
                  className="bg-purple-800/30 hover:bg-purple-800/50 rounded-lg p-4 transition-all border border-purple-500/20 flex flex-col items-center gap-2"
                >
                  <Scroll className="w-8 h-8 text-purple-400" />
                  <span className="text-sm text-purple-200">Session Notes</span>
                </button>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 lg:col-span-2">
              <h3 className="text-xl font-bold text-purple-300 mb-4">Your D&D Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">{characters.length}</div>
                  <div className="text-sm text-purple-300">Characters</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">{campaigns.length}</div>
                  <div className="text-sm text-purple-300">Campaigns</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">
                    {campaigns.reduce((sum, c) => sum + c.sessions, 0)}
                  </div>
                  <div className="text-sm text-purple-300">Sessions Played</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">
                    {characters.reduce((max, char) => Math.max(max, char.level), 0)}
                  </div>
                  <div className="text-sm text-purple-300">Highest Level</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'characters':
        return <CharacterSheet characters={characters} setCharacters={setCharacters} selectedCharacter={selectedCharacter} />;
      case 'dice':
        return <DiceRoller />;
      case 'spells':
        return <SpellBook />;
      case 'monsters':
        return <MonsterManual />;
      case 'campaigns':
        return <CampaignManager campaigns={campaigns} setCampaigns={setCampaigns} selectedCampaign={selectedCampaign} />;
      case 'initiative':
        return <InitiativeTracker characters={characters} />;
      case 'items':
        return <ItemDatabase />;
      case 'homebrew':
        return <HomebrewCreator />;
      case 'sessions':
        return <SessionNotes campaigns={campaigns} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-purple-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-purple-600 to-purple-600 rounded-xl p-3">
                <Dices className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-400 bg-clip-text text-transparent">
                  D&D Beyond Hub
                </h1>
                <p className="text-purple-300">Your complete tabletop gaming companion</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 bg-purple-600/50 hover:bg-purple-600/70 rounded-lg transition-all flex items-center gap-2"
                onClick={() => {/* TODO: Implement sync */}}
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden md:inline">Sync</span>
              </button>
              <button
                className="px-4 py-2 bg-purple-600/50 hover:bg-purple-600/70 rounded-lg transition-all flex items-center gap-2"
                onClick={() => {/* TODO: Implement settings */}}
              >
                <Settings className="w-4 h-4" />
                <span className="hidden md:inline">Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-purple-900/20">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-900/30 text-purple-300 hover:bg-purple-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default DnDBeyondHub;
