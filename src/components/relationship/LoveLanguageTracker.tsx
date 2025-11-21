import React, { useState, useEffect } from 'react';
import { Heart, User, Users, Gift, Clock, MessageCircle, Hand, Sparkles, TrendingUp, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

interface LoveLanguage {
  id: string;
  name: string;
  description: string;
  icon: any;
  examples: string[];
}

interface PersonProfile {
  id: string;
  name: string;
  relationship: string;
  primaryLanguage: string;
  secondaryLanguage: string;
  notes: string;
  createdAt: number;
}

interface LoveLanguageAction {
  id: string;
  personId: string;
  personName: string;
  languageType: string;
  action: string;
  date: string;
  impact: 'low' | 'medium' | 'high';
  notes: string;
  timestamp: number;
}

const loveLanguages: LoveLanguage[] = [
  {
    id: 'words',
    name: 'Words of Affirmation',
    description: 'Verbal compliments, encouragement, and appreciation',
    icon: MessageCircle,
    examples: [
      'I love you',
      'I appreciate you',
      'You did a great job',
      'I\'m proud of you',
      'Thank you for being you',
      'You make me so happy',
    ],
  },
  {
    id: 'quality',
    name: 'Quality Time',
    description: 'Undivided attention and meaningful togetherness',
    icon: Clock,
    examples: [
      'Deep conversations',
      'Date nights',
      'Shared hobbies',
      'Walks together',
      'Cooking together',
      'Phone-free time',
    ],
  },
  {
    id: 'acts',
    name: 'Acts of Service',
    description: 'Doing helpful things to ease their burden',
    icon: Heart,
    examples: [
      'Doing chores',
      'Making meals',
      'Running errands',
      'Helping with tasks',
      'Taking care of responsibilities',
      'Fixing things',
    ],
  },
  {
    id: 'physical',
    name: 'Physical Touch',
    description: 'Hugs, kisses, holding hands, physical affection',
    icon: Hand,
    examples: [
      'Hugs',
      'Kisses',
      'Holding hands',
      'Back rubs',
      'Cuddling',
      'Sitting close',
    ],
  },
  {
    id: 'gifts',
    name: 'Receiving Gifts',
    description: 'Thoughtful presents and tokens of love',
    icon: Gift,
    examples: [
      'Thoughtful surprises',
      'Favorite treats',
      'Meaningful tokens',
      'Flowers',
      'Handmade items',
      'Just-because gifts',
    ],
  },
];

const LoveLanguageTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profiles' | 'actions' | 'learn'>('profiles');
  const [profiles, setProfiles] = useState<PersonProfile[]>([]);
  const [actions, setActions] = useState<LoveLanguageAction[]>([]);
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [showAddAction, setShowAddAction] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  // New Profile Form
  const [newProfile, setNewProfile] = useState({
    name: '',
    relationship: '',
    primaryLanguage: '',
    secondaryLanguage: '',
    notes: '',
  });

  // New Action Form
  const [newAction, setNewAction] = useState({
    personId: '',
    languageType: '',
    action: '',
    date: new Date().toISOString().split('T')[0],
    impact: 'medium' as 'low' | 'medium' | 'high',
    notes: '',
  });

  // Load data
  useEffect(() => {
    const savedProfiles = localStorage.getItem('loveLanguageProfiles');
    const savedActions = localStorage.getItem('loveLanguageActions');

    if (savedProfiles) setProfiles(JSON.parse(savedProfiles));
    if (savedActions) setActions(JSON.parse(savedActions));
  }, []);

  // Save profiles
  const saveProfiles = (updated: PersonProfile[]) => {
    setProfiles(updated);
    localStorage.setItem('loveLanguageProfiles', JSON.stringify(updated));
  };

  // Save actions
  const saveActions = (updated: LoveLanguageAction[]) => {
    setActions(updated);
    localStorage.setItem('loveLanguageActions', JSON.stringify(updated));
  };

  // Add profile
  const handleAddProfile = () => {
    if (!newProfile.name || !newProfile.primaryLanguage) {
      toast.error('Name and primary love language are required');
      return;
    }

    const profile: PersonProfile = {
      id: Date.now().toString(),
      name: newProfile.name,
      relationship: newProfile.relationship,
      primaryLanguage: newProfile.primaryLanguage,
      secondaryLanguage: newProfile.secondaryLanguage,
      notes: newProfile.notes,
      createdAt: Date.now(),
    };

    saveProfiles([...profiles, profile]);
    setNewProfile({ name: '', relationship: '', primaryLanguage: '', secondaryLanguage: '', notes: '' });
    setShowAddProfile(false);
    toast.success(`${profile.name}'s profile added!`);
  };

  // Delete profile
  const handleDeleteProfile = (id: string) => {
    if (confirm('Delete this profile? All associated actions will remain but won\'t be linked.')) {
      saveProfiles(profiles.filter(p => p.id !== id));
      toast.success('Profile deleted');
    }
  };

  // Add action
  const handleAddAction = () => {
    if (!newAction.personId || !newAction.languageType || !newAction.action) {
      toast.error('Person, language type, and action are required');
      return;
    }

    const person = profiles.find(p => p.id === newAction.personId);
    if (!person) {
      toast.error('Person not found');
      return;
    }

    const action: LoveLanguageAction = {
      id: Date.now().toString(),
      personId: newAction.personId,
      personName: person.name,
      languageType: newAction.languageType,
      action: newAction.action,
      date: newAction.date,
      impact: newAction.impact,
      notes: newAction.notes,
      timestamp: Date.now(),
    };

    saveActions([action, ...actions]);
    setNewAction({
      personId: '',
      languageType: '',
      action: '',
      date: new Date().toISOString().split('T')[0],
      impact: 'medium',
      notes: '',
    });
    setShowAddAction(false);
    toast.success('Love language action logged!');
  };

  // Delete action
  const handleDeleteAction = (id: string) => {
    if (confirm('Delete this action log?')) {
      saveActions(actions.filter(a => a.id !== id));
      toast.success('Action deleted');
    }
  };

  // Get language by id
  const getLanguage = (id: string) => loveLanguages.find(l => l.id === id);

  // Export data
  const handleExport = () => {
    const data = { profiles, actions };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `love-languages-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast.success('Exported love language data!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Love Language Tracker</h2>
          <p className="text-purple-400">Understand and speak each other's love languages</p>
        </div>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg border border-purple-500/30 hover:bg-purple-500/30 transition-all"
        >
          Export Data
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profiles')}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
            activeTab === 'profiles'
              ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
              : 'bg-purple-900/20 text-purple-400 hover:bg-purple-500/20'
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Profiles</span>
          <span className="px-2 py-0.5 bg-purple-500/20 rounded-full text-xs">{profiles.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('actions')}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
            activeTab === 'actions'
              ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
              : 'bg-purple-900/20 text-purple-400 hover:bg-purple-500/20'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span>Actions Log</span>
          <span className="px-2 py-0.5 bg-purple-500/20 rounded-full text-xs">{actions.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('learn')}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
            activeTab === 'learn'
              ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
              : 'bg-purple-900/20 text-purple-400 hover:bg-purple-500/20'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span>Learn</span>
        </button>
      </div>

      {/* Profiles Tab */}
      {activeTab === 'profiles' && (
        <div className="space-y-4">
          <button
            onClick={() => setShowAddProfile(!showAddProfile)}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-500/20 to-purple-500/20 border border-purple-500/30 rounded-xl text-purple-300 font-semibold hover:from-purple-500/30 hover:to-purple-500/30 transition-all"
          >
            {showAddProfile ? 'Cancel' : '+ Add Person Profile'}
          </button>

          {/* Add Profile Form */}
          {showAddProfile && (
            <div className="bg-purple-900/20 p-6 rounded-xl border border-purple-500/30 space-y-4">
              <h3 className="text-xl font-bold text-white">New Person Profile</h3>

              <div>
                <label className="block text-purple-300 font-semibold mb-2">Name *</label>
                <input
                  type="text"
                  value={newProfile.name}
                  onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="Their name"
                />
              </div>

              <div>
                <label className="block text-purple-300 font-semibold mb-2">Relationship</label>
                <input
                  type="text"
                  value={newProfile.relationship}
                  onChange={(e) => setNewProfile({ ...newProfile, relationship: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="Partner, Friend, Family, etc."
                />
              </div>

              <div>
                <label className="block text-purple-300 font-semibold mb-2">Primary Love Language *</label>
                <select
                  value={newProfile.primaryLanguage}
                  onChange={(e) => setNewProfile({ ...newProfile, primaryLanguage: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="">Select...</option>
                  {loveLanguages.map(lang => (
                    <option key={lang.id} value={lang.id}>{lang.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-purple-300 font-semibold mb-2">Secondary Love Language</label>
                <select
                  value={newProfile.secondaryLanguage}
                  onChange={(e) => setNewProfile({ ...newProfile, secondaryLanguage: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="">Select...</option>
                  {loveLanguages.map(lang => (
                    <option key={lang.id} value={lang.id}>{lang.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-purple-300 font-semibold mb-2">Notes</label>
                <textarea
                  value={newProfile.notes}
                  onChange={(e) => setNewProfile({ ...newProfile, notes: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 h-24"
                  placeholder="What specifically do they love? What makes them feel loved?"
                />
              </div>

              <button
                onClick={handleAddProfile}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-500/30 to-purple-500/30 border border-purple-500/50 rounded-xl text-white font-bold hover:from-purple-500/40 hover:to-purple-500/40 transition-all"
              >
                Add Profile
              </button>
            </div>
          )}

          {/* Profiles List */}
          {profiles.length === 0 ? (
            <div className="bg-purple-900/10 p-12 rounded-xl border border-purple-500/20 text-center">
              <User className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
              <p className="text-purple-400">No profiles yet. Add people to track their love languages!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profiles.map(profile => {
                const primary = getLanguage(profile.primaryLanguage);
                const secondary = profile.secondaryLanguage ? getLanguage(profile.secondaryLanguage) : null;
                const PrimaryIcon = primary?.icon || Heart;
                const SecondaryIcon = secondary?.icon || Heart;

                return (
                  <div
                    key={profile.id}
                    className="bg-gradient-to-br from-purple-900/20 to-purple-900/20 p-6 rounded-xl border border-purple-500/30 hover:border-purple-500/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">{profile.name}</h3>
                        {profile.relationship && (
                          <p className="text-purple-400 text-sm">{profile.relationship}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteProfile(profile.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Delete
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <PrimaryIcon className="w-5 h-5 text-purple-400 mt-0.5" />
                        <div>
                          <p className="text-purple-300 font-semibold">{primary?.name}</p>
                          <p className="text-purple-400/70 text-sm">{primary?.description}</p>
                        </div>
                      </div>

                      {secondary && (
                        <div className="flex items-start gap-3">
                          <SecondaryIcon className="w-5 h-5 text-purple-400 mt-0.5" />
                          <div>
                            <p className="text-purple-300 font-semibold">{secondary.name}</p>
                            <p className="text-purple-400/70 text-sm">{secondary.description}</p>
                          </div>
                        </div>
                      )}

                      {profile.notes && (
                        <div className="mt-3 p-3 bg-black/30 rounded-lg">
                          <p className="text-purple-300 text-sm">{profile.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Actions Log Tab */}
      {activeTab === 'actions' && (
        <div className="space-y-4">
          <button
            onClick={() => setShowAddAction(!showAddAction)}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-500/20 to-purple-500/20 border border-purple-500/30 rounded-xl text-purple-300 font-semibold hover:from-purple-500/30 hover:to-purple-500/30 transition-all"
            disabled={profiles.length === 0}
          >
            {showAddAction ? 'Cancel' : '+ Log Love Language Action'}
          </button>

          {profiles.length === 0 && (
            <div className="bg-purple-900/10 p-6 rounded-xl border border-purple-500/20">
              <p className="text-purple-400 text-center">Add at least one profile first to log actions</p>
            </div>
          )}

          {/* Add Action Form */}
          {showAddAction && profiles.length > 0 && (
            <div className="bg-purple-900/20 p-6 rounded-xl border border-purple-500/30 space-y-4">
              <h3 className="text-xl font-bold text-white">Log Love Language Action</h3>

              <div>
                <label className="block text-purple-300 font-semibold mb-2">Person *</label>
                <select
                  value={newAction.personId}
                  onChange={(e) => setNewAction({ ...newAction, personId: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="">Select...</option>
                  {profiles.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-purple-300 font-semibold mb-2">Love Language *</label>
                <select
                  value={newAction.languageType}
                  onChange={(e) => setNewAction({ ...newAction, languageType: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="">Select...</option>
                  {loveLanguages.map(lang => (
                    <option key={lang.id} value={lang.id}>{lang.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-purple-300 font-semibold mb-2">What You Did/Said *</label>
                <input
                  type="text"
                  value={newAction.action}
                  onChange={(e) => setNewAction({ ...newAction, action: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="Made their favorite dinner, told them I'm proud of them, etc."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-300 font-semibold mb-2">Date</label>
                  <input
                    type="date"
                    value={newAction.date}
                    onChange={(e) => setNewAction({ ...newAction, date: e.target.value })}
                    className="w-full px-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-purple-300 font-semibold mb-2">Impact</label>
                  <select
                    value={newAction.impact}
                    onChange={(e) => setNewAction({ ...newAction, impact: e.target.value as any })}
                    className="w-full px-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-purple-300 font-semibold mb-2">Notes</label>
                <textarea
                  value={newAction.notes}
                  onChange={(e) => setNewAction({ ...newAction, notes: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 h-20"
                  placeholder="How did they respond? What impact did it have?"
                />
              </div>

              <button
                onClick={handleAddAction}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-500/30 to-purple-500/30 border border-purple-500/50 rounded-xl text-white font-bold hover:from-purple-500/40 hover:to-purple-500/40 transition-all"
              >
                Log Action
              </button>
            </div>
          )}

          {/* Actions List */}
          {actions.length === 0 ? (
            <div className="bg-purple-900/10 p-12 rounded-xl border border-purple-500/20 text-center">
              <Calendar className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
              <p className="text-purple-400">No actions logged yet. Start tracking how you express love!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {actions.map(action => {
                const language = getLanguage(action.languageType);
                const LangIcon = language?.icon || Heart;
                const impactColors = {
                  low: 'text-blue-400',
                  medium: 'text-orange-400',
                  high: 'text-purple-400',
                };

                return (
                  <div
                    key={action.id}
                    className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/30 hover:border-purple-500/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <LangIcon className="w-5 h-5 text-purple-400" />
                        <div>
                          <p className="text-white font-semibold">{action.personName}</p>
                          <p className="text-purple-400 text-sm">{language?.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-semibold ${impactColors[action.impact]}`}>
                          {action.impact.toUpperCase()} IMPACT
                        </span>
                        <button
                          onClick={() => handleDeleteAction(action.id)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <p className="text-purple-200 mb-2">{action.action}</p>

                    {action.notes && (
                      <p className="text-purple-400/70 text-sm mb-2">{action.notes}</p>
                    )}

                    <p className="text-purple-500/70 text-xs">
                      {new Date(action.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Learn Tab */}
      {activeTab === 'learn' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-purple-900/20 to-purple-900/20 p-6 rounded-xl border border-purple-500/30">
            <h3 className="text-2xl font-bold text-white mb-3">The 5 Love Languages</h3>
            <p className="text-purple-300 mb-4">
              Dr. Gary Chapman identified five primary ways people express and receive love. Understanding
              these can transform your relationships by helping you speak your partner's love language.
            </p>
            <p className="text-purple-400 text-sm">
              Everyone has a primary and often a secondary love language. What makes one person feel loved
              might not work for another. Learn to speak their language!
            </p>
          </div>

          {loveLanguages.map(lang => {
            const LangIcon = lang.icon;
            const isSelected = selectedLanguage === lang.id;

            return (
              <div
                key={lang.id}
                className="bg-purple-900/20 rounded-xl border border-purple-500/30 overflow-hidden"
              >
                <button
                  onClick={() => setSelectedLanguage(isSelected ? null : lang.id)}
                  className="w-full flex items-center justify-between p-6 hover:bg-purple-500/10 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <LangIcon className="w-8 h-8 text-purple-400" />
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-white">{lang.name}</h3>
                      <p className="text-purple-400 text-sm">{lang.description}</p>
                    </div>
                  </div>
                  <span className="text-purple-400">{isSelected ? '−' : '+'}</span>
                </button>

                {isSelected && (
                  <div className="p-6 border-t border-purple-500/30 bg-black/20">
                    <h4 className="text-purple-300 font-semibold mb-3">Examples:</h4>
                    <ul className="space-y-2">
                      {lang.examples.map((example, i) => (
                        <li key={i} className="flex items-start gap-2 text-purple-200">
                          <Heart className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}

          <div className="bg-purple-900/20 p-6 rounded-xl border border-purple-500/30">
            <h3 className="text-xl font-bold text-purple-300 mb-3">
              How to Use This Tracker
            </h3>
            <ul className="space-y-2 text-purple-200">
              <li className="flex items-start gap-2">
                <span className="text-purple-400">1.</span>
                <span>Create profiles for yourself and important people in your life</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">2.</span>
                <span>Identify each person's primary and secondary love languages</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">3.</span>
                <span>Log when you express love in their language</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">4.</span>
                <span>Notice patterns - what has the most impact?</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">5.</span>
                <span>Make expressing love in their language a daily practice</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoveLanguageTracker;
