import React, { useState, useEffect } from 'react';
import { Sparkles, User, MessageCircle, Heart, Plus, X, Trash2, Calendar, CheckCircle, Star } from 'lucide-react';
import toast from 'react-hot-toast';

interface JourneyEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: string;
  category: 'realization' | 'milestone' | 'challenge' | 'celebration' | 'reflection';
  tags: string[];
  createdAt: number;
}

interface NameExploration {
  id: string;
  name: string;
  pronouns: string;
  meaning: string;
  feelings: string;
  rating: number; // 1-5
  trying: boolean;
  dateAdded: string;
  notes: string;
  createdAt: number;
}

interface PronounSet {
  id: string;
  subjective: string; // they, she, he, ze, etc.
  objective: string; // them, her, him, hir, etc.
  possessive: string; // their, her, his, hir, etc.
  possessivePronoun: string; // theirs, hers, his, hirs, etc.
  reflexive: string; // themselves, herself, himself, hirself, etc.
  preference: 'preferred' | 'okay' | 'avoid';
  notes: string;
  createdAt: number;
}

interface ComingOutPlan {
  id: string;
  person: string;
  relationship: string;
  plannedDate: string;
  status: 'planning' | 'ready' | 'completed' | 'postponed';
  method: 'in-person' | 'letter' | 'text' | 'email' | 'call' | 'other';
  safetyLevel: number; // 1-5, 5 being very safe
  supportPerson: string;
  script: string;
  notes: string;
  actualDate?: string;
  outcome?: string;
  createdAt: number;
}

type TabType = 'overview' | 'journey' | 'names' | 'pronouns' | 'coming-out';

const moodEmojis = ['😔', '😐', '🙂', '😊', '🎉'];
const categoryColors = {
  realization: 'bg-blue-500/20 text-blue-300',
  milestone: 'bg-green-500/20 text-green-300',
  challenge: 'bg-orange-500/20 text-orange-300',
  celebration: 'bg-purple-500/20 text-purple-300',
  reflection: 'bg-cyan-500/20 text-cyan-300',
};

const commonPronounSets = [
  { subjective: 'they', objective: 'them', possessive: 'their', possessivePronoun: 'theirs', reflexive: 'themselves' },
  { subjective: 'she', objective: 'her', possessive: 'her', possessivePronoun: 'hers', reflexive: 'herself' },
  { subjective: 'he', objective: 'him', possessive: 'his', possessivePronoun: 'his', reflexive: 'himself' },
  { subjective: 'ze', objective: 'hir', possessive: 'hir', possessivePronoun: 'hirs', reflexive: 'hirself' },
  { subjective: 'xe', objective: 'xem', possessive: 'xyr', possessivePronoun: 'xyrs', reflexive: 'xemself' },
];

export default function IdentityHubPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [journey, setJourney] = useState<JourneyEntry[]>([]);
  const [names, setNames] = useState<NameExploration[]>([]);
  const [pronouns, setPronouns] = useState<PronounSet[]>([]);
  const [comingOut, setComingOut] = useState<ComingOutPlan[]>([]);

  const [isAddingJourney, setIsAddingJourney] = useState(false);
  const [isAddingName, setIsAddingName] = useState(false);
  const [isAddingPronoun, setIsAddingPronoun] = useState(false);
  const [isAddingComingOut, setIsAddingComingOut] = useState(false);

  // Journey form
  const [journeyForm, setJourneyForm] = useState({
    date: new Date().toISOString().split('T')[0],
    title: '',
    content: '',
    mood: '3',
    category: 'reflection' as JourneyEntry['category'],
  });
  const [journeyTags, setJourneyTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // Name form
  const [nameForm, setNameForm] = useState({
    name: '',
    pronouns: '',
    meaning: '',
    feelings: '',
    rating: 3,
    notes: '',
  });

  // Pronoun form
  const [pronounForm, setPronounForm] = useState({
    subjective: '',
    objective: '',
    possessive: '',
    possessivePronoun: '',
    reflexive: '',
    preference: 'preferred' as PronounSet['preference'],
    notes: '',
  });

  // Coming out form
  const [comingOutForm, setComingOutForm] = useState({
    person: '',
    relationship: '',
    plannedDate: '',
    method: 'in-person' as ComingOutPlan['method'],
    safetyLevel: 5,
    supportPerson: '',
    script: '',
    notes: '',
  });

  useEffect(() => {
    const savedJourney = localStorage.getItem('identityJourney');
    const savedNames = localStorage.getItem('identityNames');
    const savedPronouns = localStorage.getItem('identityPronouns');
    const savedComingOut = localStorage.getItem('identityComingOut');
    if (savedJourney) setJourney(JSON.parse(savedJourney));
    if (savedNames) setNames(JSON.parse(savedNames));
    if (savedPronouns) setPronouns(JSON.parse(savedPronouns));
    if (savedComingOut) setComingOut(JSON.parse(savedComingOut));
  }, []);

  useEffect(() => {
    localStorage.setItem('identityJourney', JSON.stringify(journey));
  }, [journey]);

  useEffect(() => {
    localStorage.setItem('identityNames', JSON.stringify(names));
  }, [names]);

  useEffect(() => {
    localStorage.setItem('identityPronouns', JSON.stringify(pronouns));
  }, [pronouns]);

  useEffect(() => {
    localStorage.setItem('identityComingOut', JSON.stringify(comingOut));
  }, [comingOut]);

  const handleJourneySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journeyForm.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    const newEntry: JourneyEntry = {
      id: Date.now().toString(),
      ...journeyForm,
      tags: journeyTags,
      createdAt: Date.now(),
    };

    setJourney([...journey, newEntry]);
    setJourneyForm({ date: new Date().toISOString().split('T')[0], title: '', content: '', mood: '3', category: 'reflection' });
    setJourneyTags([]);
    setIsAddingJourney(false);
    toast.success('Journey entry added!');
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameForm.name.trim()) {
      toast.error('Please enter a name');
      return;
    }

    const newName: NameExploration = {
      id: Date.now().toString(),
      ...nameForm,
      trying: false,
      dateAdded: new Date().toISOString().split('T')[0],
      createdAt: Date.now(),
    };

    setNames([...names, newName]);
    setNameForm({ name: '', pronouns: '', meaning: '', feelings: '', rating: 3, notes: '' });
    setIsAddingName(false);
    toast.success('Name added!');
  };

  const handlePronounSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pronounForm.subjective.trim()) {
      toast.error('Please enter at least the subjective pronoun');
      return;
    }

    const newPronoun: PronounSet = {
      id: Date.now().toString(),
      ...pronounForm,
      createdAt: Date.now(),
    };

    setPronouns([...pronouns, newPronoun]);
    setPronounForm({ subjective: '', objective: '', possessive: '', possessivePronoun: '', reflexive: '', preference: 'preferred', notes: '' });
    setIsAddingPronoun(false);
    toast.success('Pronoun set added!');
  };

  const handleComingOutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comingOutForm.person.trim()) {
      toast.error('Please enter a person');
      return;
    }

    const newPlan: ComingOutPlan = {
      id: Date.now().toString(),
      ...comingOutForm,
      status: 'planning',
      createdAt: Date.now(),
    };

    setComingOut([...comingOut, newPlan]);
    setComingOutForm({ person: '', relationship: '', plannedDate: '', method: 'in-person', safetyLevel: 5, supportPerson: '', script: '', notes: '' });
    setIsAddingComingOut(false);
    toast.success('Coming out plan added!');
  };

  const toggleNameTrying = (id: string) => {
    setNames(names.map(n => n.id === id ? { ...n, trying: !n.trying } : n));
  };

  const updateComingOutStatus = (id: string, status: ComingOutPlan['status'], outcome?: string) => {
    setComingOut(comingOut.map(plan =>
      plan.id === id
        ? {
            ...plan,
            status,
            actualDate: status === 'completed' ? new Date().toISOString().split('T')[0] : plan.actualDate,
            outcome: outcome || plan.outcome
          }
        : plan
    ));
  };

  const deleteJourneyEntry = (id: string) => {
    if (confirm('Delete this entry?')) {
      setJourney(journey.filter(e => e.id !== id));
      toast.success('Entry deleted');
    }
  };

  const deleteName = (id: string) => {
    if (confirm('Delete this name?')) {
      setNames(names.filter(n => n.id !== id));
      toast.success('Name deleted');
    }
  };

  const deletePronoun = (id: string) => {
    if (confirm('Delete this pronoun set?')) {
      setPronouns(pronouns.filter(p => p.id !== id));
      toast.success('Pronoun set deleted');
    }
  };

  const deleteComingOut = (id: string) => {
    if (confirm('Delete this plan?')) {
      setComingOut(comingOut.filter(p => p.id !== id));
      toast.success('Plan deleted');
    }
  };

  const addJourneyTag = () => {
    if (!tagInput.trim() || journeyTags.includes(tagInput.trim())) return;
    setJourneyTags([...journeyTags, tagInput.trim()]);
    setTagInput('');
  };

  const loadCommonPronounSet = (set: typeof commonPronounSets[0]) => {
    setPronounForm({ ...pronounForm, ...set });
  };

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: Sparkles },
    { id: 'journey' as TabType, label: 'Journey', icon: Heart },
    { id: 'names' as TabType, label: 'Names', icon: User },
    { id: 'pronouns' as TabType, label: 'Pronouns', icon: MessageCircle },
    { id: 'coming-out' as TabType, label: 'Coming Out', icon: Star },
  ];

  const getPreferenceColor = (pref: string) => {
    switch (pref) {
      case 'preferred': return 'bg-green-500/20 text-green-300';
      case 'okay': return 'bg-blue-500/20 text-blue-300';
      case 'avoid': return 'bg-red-500/20 text-red-300';
      default: return 'bg-purple-500/20 text-purple-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-500/20 text-blue-300';
      case 'ready': return 'bg-green-500/20 text-green-300';
      case 'completed': return 'bg-purple-500/20 text-purple-300';
      case 'postponed': return 'bg-orange-500/20 text-orange-300';
      default: return 'bg-purple-500/20 text-purple-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-violet-950 to-indigo-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-violet-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Identity Hub
            </h1>
          </div>
          <p className="text-violet-400">
            Explore and celebrate your authentic self
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-violet-900/20 p-2 rounded-xl border border-violet-500/30 mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-violet-500/30 text-violet-300 border border-violet-500/50'
                      : 'bg-violet-900/20 text-violet-400 hover:bg-violet-500/20'
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-violet-900/30 to-purple-900/30 p-6 rounded-xl border border-violet-500/30">
                  <Heart className="w-8 h-8 text-violet-400 mb-3" />
                  <h3 className="text-2xl font-bold text-white mb-1">{journey.length}</h3>
                  <p className="text-violet-200/70">Journey Entries</p>
                </div>
                <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-6 rounded-xl border border-purple-500/30">
                  <User className="w-8 h-8 text-purple-400 mb-3" />
                  <h3 className="text-2xl font-bold text-white mb-1">{names.length}</h3>
                  <p className="text-purple-200/70">Names Exploring</p>
                </div>
                <div className="bg-gradient-to-br from-indigo-900/30 to-blue-900/30 p-6 rounded-xl border border-indigo-500/30">
                  <MessageCircle className="w-8 h-8 text-indigo-400 mb-3" />
                  <h3 className="text-2xl font-bold text-white mb-1">{pronouns.length}</h3>
                  <p className="text-indigo-200/70">Pronoun Sets</p>
                </div>
                <div className="bg-gradient-to-br from-blue-900/30 to-violet-900/30 p-6 rounded-xl border border-blue-500/30">
                  <Star className="w-8 h-8 text-blue-400 mb-3" />
                  <h3 className="text-2xl font-bold text-white mb-1">{comingOut.filter(p => p.status === 'completed').length}/{comingOut.length}</h3>
                  <p className="text-blue-200/70">Came Out</p>
                </div>
              </div>

              <div className="bg-violet-900/20 p-6 rounded-xl border border-violet-500/30">
                <h3 className="text-xl font-bold text-violet-300 mb-3">About Identity Hub</h3>
                <p className="text-violet-200 mb-3">
                  Your identity is valid, beautiful, and worthy of exploration. This is a safe space to document your journey,
                  try on new names and pronouns, and plan coming out conversations at your own pace.
                </p>
                <div className="space-y-2 text-violet-100">
                  <p><strong>Journey:</strong> Document realizations, milestones, challenges, and celebrations</p>
                  <p><strong>Names:</strong> Explore different names and see what feels right</p>
                  <p><strong>Pronouns:</strong> Track preferred pronoun sets and practice using them</p>
                  <p><strong>Coming Out:</strong> Plan and track coming out conversations safely</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'journey' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Heart className="w-7 h-7 text-violet-400" />
                    Gender Journey
                  </h2>
                  <p className="text-violet-200/70 mt-1">{journey.length} entries</p>
                </div>
                <button
                  onClick={() => setIsAddingJourney(!isAddingJourney)}
                  className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-500 hover:to-purple-500 transition-all flex items-center gap-2"
                >
                  {isAddingJourney ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {isAddingJourney ? 'Cancel' : 'Add Entry'}
                </button>
              </div>

              {isAddingJourney && (
                <form onSubmit={handleJourneySubmit} className="bg-gradient-to-br from-violet-900/30 to-purple-900/30 rounded-xl p-6 border border-violet-500/20 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="date"
                      value={journeyForm.date}
                      onChange={(e) => setJourneyForm({ ...journeyForm, date: e.target.value })}
                      className="bg-black/40 border border-violet-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-400"
                    />
                    <select
                      value={journeyForm.category}
                      onChange={(e) => setJourneyForm({ ...journeyForm, category: e.target.value as JourneyEntry['category'] })}
                      className="bg-black/40 border border-violet-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-400"
                    >
                      <option value="reflection">Reflection</option>
                      <option value="realization">Realization</option>
                      <option value="milestone">Milestone</option>
                      <option value="challenge">Challenge</option>
                      <option value="celebration">Celebration</option>
                    </select>
                  </div>

                  <input
                    type="text"
                    value={journeyForm.title}
                    onChange={(e) => setJourneyForm({ ...journeyForm, title: e.target.value })}
                    className="w-full bg-black/40 border border-violet-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-400"
                    placeholder="Entry title..."
                    required
                  />

                  <textarea
                    value={journeyForm.content}
                    onChange={(e) => setJourneyForm({ ...journeyForm, content: e.target.value })}
                    className="w-full bg-black/40 border border-violet-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-400 min-h-[120px]"
                    placeholder="Write your thoughts..."
                  />

                  <div>
                    <label className="text-violet-300 text-sm mb-2 block">How are you feeling?</label>
                    <div className="flex gap-2">
                      {moodEmojis.map((emoji, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setJourneyForm({ ...journeyForm, mood: (idx + 1).toString() })}
                          className={`text-3xl p-3 rounded-lg transition-all ${
                            journeyForm.mood === (idx + 1).toString()
                              ? 'bg-violet-500/30 scale-110'
                              : 'bg-black/20 hover:bg-violet-500/20'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addJourneyTag();
                        }
                      }}
                      className="flex-1 bg-black/40 border border-violet-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-violet-400"
                      placeholder="Add tags..."
                    />
                    <button type="button" onClick={addJourneyTag} className="px-4 py-2 bg-violet-500/20 text-violet-300 rounded-lg hover:bg-violet-500/30">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  {journeyTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {journeyTags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-violet-500/20 text-violet-300 rounded-full text-sm flex items-center gap-2">
                          #{tag}
                          <button type="button" onClick={() => setJourneyTags(journeyTags.filter(t => t !== tag))}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-500 hover:to-purple-500 transition-all font-medium"
                  >
                    Add Entry
                  </button>
                </form>
              )}

              <div className="space-y-4">
                {journey.length === 0 ? (
                  <div className="text-center py-12 bg-gradient-to-br from-violet-900/20 to-purple-900/20 rounded-xl border border-violet-500/20">
                    <Heart className="w-16 h-16 text-violet-400/50 mx-auto mb-4" />
                    <p className="text-violet-200/70">Start documenting your journey - your story matters!</p>
                  </div>
                ) : (
                  journey.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(entry => (
                    <div key={entry.id} className="bg-gradient-to-br from-violet-900/30 to-purple-900/30 rounded-xl p-5 border border-violet-500/20 hover:border-violet-400/40 transition-all">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${categoryColors[entry.category]}`}>
                              {entry.category}
                            </span>
                            <span className="text-violet-300/70 text-sm">{new Date(entry.date).toLocaleDateString()}</span>
                            <span className="text-2xl">{moodEmojis[parseInt(entry.mood) - 1]}</span>
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-2">{entry.title}</h3>
                        </div>
                        <button onClick={() => deleteJourneyEntry(entry.id)} className="p-1 text-red-300 hover:text-red-200">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      {entry.content && <p className="text-violet-200/70 whitespace-pre-wrap mb-3">{entry.content}</p>}
                      {entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {entry.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs">#{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'names' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <User className="w-7 h-7 text-purple-400" />
                    Name Exploration
                  </h2>
                  <p className="text-purple-200/70 mt-1">{names.length} names exploring</p>
                </div>
                <button
                  onClick={() => setIsAddingName(!isAddingName)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-500 hover:to-violet-500 transition-all flex items-center gap-2"
                >
                  {isAddingName ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {isAddingName ? 'Cancel' : 'Add Name'}
                </button>
              </div>

              {isAddingName && (
                <form onSubmit={handleNameSubmit} className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-6 border border-purple-500/20 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={nameForm.name}
                      onChange={(e) => setNameForm({ ...nameForm, name: e.target.value })}
                      className="bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                      placeholder="Name to explore"
                      required
                    />
                    <input
                      type="text"
                      value={nameForm.pronouns}
                      onChange={(e) => setNameForm({ ...nameForm, pronouns: e.target.value })}
                      className="bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                      placeholder="Pronouns (e.g., they/them)"
                    />
                  </div>

                  <input
                    type="text"
                    value={nameForm.meaning}
                    onChange={(e) => setNameForm({ ...nameForm, meaning: e.target.value })}
                    className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
                    placeholder="Meaning or origin..."
                  />

                  <textarea
                    value={nameForm.feelings}
                    onChange={(e) => setNameForm({ ...nameForm, feelings: e.target.value })}
                    className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400 min-h-[80px]"
                    placeholder="How does this name make you feel?"
                  />

                  <div>
                    <label className="text-purple-300 text-sm mb-2 block">Rating (1-5)</label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={nameForm.rating}
                      onChange={(e) => setNameForm({ ...nameForm, rating: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-purple-200 text-sm mt-1">
                      <span>Not sure</span>
                      <span className="font-bold text-lg">{'⭐'.repeat(nameForm.rating)}</span>
                      <span>Love it!</span>
                    </div>
                  </div>

                  <textarea
                    value={nameForm.notes}
                    onChange={(e) => setNameForm({ ...nameForm, notes: e.target.value })}
                    className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400 min-h-[80px]"
                    placeholder="Additional notes..."
                  />

                  <button
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg hover:from-purple-500 hover:to-violet-500 transition-all font-medium"
                  >
                    Add Name
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {names.length === 0 ? (
                  <div className="col-span-full text-center py-12 bg-gradient-to-br from-purple-900/20 to-violet-900/20 rounded-xl border border-purple-500/20">
                    <User className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
                    <p className="text-purple-200/70">Explore names that resonate with you!</p>
                  </div>
                ) : (
                  names.sort((a, b) => b.rating - a.rating).map(name => (
                    <div key={name.id} className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 rounded-xl p-5 border border-purple-500/20 hover:border-purple-400/40 transition-all">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white">{name.name}</h3>
                          {name.pronouns && <p className="text-purple-300/70 text-sm">{name.pronouns}</p>}
                        </div>
                        <button onClick={() => deleteName(name.id)} className="p-1 text-red-300 hover:text-red-200">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="mb-3">
                        <span className="text-2xl">{'⭐'.repeat(name.rating)}</span>
                      </div>

                      {name.meaning && (
                        <div className="mb-2">
                          <p className="text-purple-300 text-sm font-medium">Meaning:</p>
                          <p className="text-purple-200/70 text-sm">{name.meaning}</p>
                        </div>
                      )}

                      {name.feelings && (
                        <div className="mb-3">
                          <p className="text-purple-300 text-sm font-medium">Feelings:</p>
                          <p className="text-purple-200/70 text-sm italic">{name.feelings}</p>
                        </div>
                      )}

                      {name.notes && <p className="text-purple-200/70 text-sm mb-3">{name.notes}</p>}

                      <button
                        onClick={() => toggleNameTrying(name.id)}
                        className={`w-full py-2 rounded-lg font-medium transition-all ${
                          name.trying
                            ? 'bg-green-500/30 text-green-300 border border-green-500/50'
                            : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                        }`}
                      >
                        {name.trying ? '✓ Currently Trying' : 'Try This Name'}
                      </button>

                      <p className="text-purple-300/50 text-xs mt-2 text-center">{new Date(name.dateAdded).toLocaleDateString()}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'pronouns' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <MessageCircle className="w-7 h-7 text-indigo-400" />
                    Pronouns
                  </h2>
                  <p className="text-indigo-200/70 mt-1">{pronouns.length} pronoun sets</p>
                </div>
                <button
                  onClick={() => setIsAddingPronoun(!isAddingPronoun)}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all flex items-center gap-2"
                >
                  {isAddingPronoun ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {isAddingPronoun ? 'Cancel' : 'Add Pronouns'}
                </button>
              </div>

              {isAddingPronoun && (
                <form onSubmit={handlePronounSubmit} className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl p-6 border border-indigo-500/20 space-y-4">
                  <div>
                    <label className="text-indigo-300 text-sm mb-2 block">Quick Select (Common Sets)</label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {commonPronounSets.map((set, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => loadCommonPronounSet(set)}
                          className="px-3 py-2 bg-indigo-500/20 text-indigo-300 rounded-lg hover:bg-indigo-500/30 text-sm"
                        >
                          {set.subjective}/{set.objective}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-indigo-300 text-sm mb-1 block">Subjective (they, she, he)</label>
                      <input
                        type="text"
                        value={pronounForm.subjective}
                        onChange={(e) => setPronounForm({ ...pronounForm, subjective: e.target.value })}
                        className="w-full bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400"
                        placeholder="they"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-indigo-300 text-sm mb-1 block">Objective (them, her, him)</label>
                      <input
                        type="text"
                        value={pronounForm.objective}
                        onChange={(e) => setPronounForm({ ...pronounForm, objective: e.target.value })}
                        className="w-full bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400"
                        placeholder="them"
                      />
                    </div>
                    <div>
                      <label className="text-indigo-300 text-sm mb-1 block">Possessive (their, her, his)</label>
                      <input
                        type="text"
                        value={pronounForm.possessive}
                        onChange={(e) => setPronounForm({ ...pronounForm, possessive: e.target.value })}
                        className="w-full bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400"
                        placeholder="their"
                      />
                    </div>
                    <div>
                      <label className="text-indigo-300 text-sm mb-1 block">Possessive Pronoun (theirs, hers, his)</label>
                      <input
                        type="text"
                        value={pronounForm.possessivePronoun}
                        onChange={(e) => setPronounForm({ ...pronounForm, possessivePronoun: e.target.value })}
                        className="w-full bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400"
                        placeholder="theirs"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-indigo-300 text-sm mb-1 block">Reflexive (themselves, herself, himself)</label>
                      <input
                        type="text"
                        value={pronounForm.reflexive}
                        onChange={(e) => setPronounForm({ ...pronounForm, reflexive: e.target.value })}
                        className="w-full bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400"
                        placeholder="themselves"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-indigo-300 text-sm mb-2 block">Preference</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['preferred', 'okay', 'avoid'] as const).map(pref => (
                        <button
                          key={pref}
                          type="button"
                          onClick={() => setPronounForm({ ...pronounForm, preference: pref })}
                          className={`py-2 rounded-lg font-medium transition-all ${
                            pronounForm.preference === pref
                              ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/50'
                              : 'bg-black/20 text-indigo-400 hover:bg-indigo-500/20'
                          }`}
                        >
                          {pref.charAt(0).toUpperCase() + pref.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    value={pronounForm.notes}
                    onChange={(e) => setPronounForm({ ...pronounForm, notes: e.target.value })}
                    className="w-full bg-black/40 border border-indigo-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-400 min-h-[80px]"
                    placeholder="Notes about these pronouns..."
                  />

                  <button
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all font-medium"
                  >
                    Add Pronoun Set
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pronouns.length === 0 ? (
                  <div className="col-span-full text-center py-12 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-xl border border-indigo-500/20">
                    <MessageCircle className="w-16 h-16 text-indigo-400/50 mx-auto mb-4" />
                    <p className="text-indigo-200/70">Add pronoun sets to track your preferences!</p>
                  </div>
                ) : (
                  pronouns.map(pronoun => (
                    <div key={pronoun.id} className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl p-5 border border-indigo-500/20 hover:border-indigo-400/40 transition-all">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white">{pronoun.subjective}/{pronoun.objective}</h3>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${getPreferenceColor(pronoun.preference)}`}>
                            {pronoun.preference}
                          </span>
                        </div>
                        <button onClick={() => deletePronoun(pronoun.id)} className="p-1 text-red-300 hover:text-red-200">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-2 text-sm mb-3">
                        <div className="bg-black/20 p-3 rounded">
                          <p className="text-indigo-300/70 mb-1">Example usage:</p>
                          <p className="text-indigo-200">
                            <strong>{pronoun.subjective}</strong> went to the store. I saw <strong>{pronoun.objective}</strong> there.
                            That is <strong>{pronoun.possessive}</strong> book. The book is <strong>{pronoun.possessivePronoun}</strong>.
                            <strong>{pronoun.subjective}</strong> did it <strong>{pronoun.reflexive}</strong>.
                          </p>
                        </div>
                      </div>

                      {pronoun.notes && <p className="text-indigo-200/70 text-sm italic">{pronoun.notes}</p>}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'coming-out' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Star className="w-7 h-7 text-blue-400" />
                    Coming Out Planning
                  </h2>
                  <p className="text-blue-200/70 mt-1">{comingOut.length} plans</p>
                </div>
                <button
                  onClick={() => setIsAddingComingOut(!isAddingComingOut)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center gap-2"
                >
                  {isAddingComingOut ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {isAddingComingOut ? 'Cancel' : 'Add Plan'}
                </button>
              </div>

              <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/30">
                <p className="text-blue-200 text-sm">
                  <strong>Safety First:</strong> Only come out when you feel safe and ready. It's okay to wait, and it's okay to be selective about who you tell.
                  Consider having a support person with you or nearby.
                </p>
              </div>

              {isAddingComingOut && (
                <form onSubmit={handleComingOutSubmit} className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-xl p-6 border border-blue-500/20 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={comingOutForm.person}
                      onChange={(e) => setComingOutForm({ ...comingOutForm, person: e.target.value })}
                      className="bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                      placeholder="Person's name"
                      required
                    />
                    <input
                      type="text"
                      value={comingOutForm.relationship}
                      onChange={(e) => setComingOutForm({ ...comingOutForm, relationship: e.target.value })}
                      className="bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                      placeholder="Relationship (e.g., parent, friend)"
                    />
                    <input
                      type="date"
                      value={comingOutForm.plannedDate}
                      onChange={(e) => setComingOutForm({ ...comingOutForm, plannedDate: e.target.value })}
                      className="bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                    />
                    <select
                      value={comingOutForm.method}
                      onChange={(e) => setComingOutForm({ ...comingOutForm, method: e.target.value as ComingOutPlan['method'] })}
                      className="bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                    >
                      <option value="in-person">In Person</option>
                      <option value="letter">Letter</option>
                      <option value="text">Text</option>
                      <option value="email">Email</option>
                      <option value="call">Phone Call</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-blue-300 text-sm mb-2 block">Safety Level (1=unsafe, 5=very safe)</label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={comingOutForm.safetyLevel}
                      onChange={(e) => setComingOutForm({ ...comingOutForm, safetyLevel: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-blue-200 text-sm mt-1">
                      <span>Unsafe</span>
                      <span className="font-bold">{comingOutForm.safetyLevel}/5</span>
                      <span>Very Safe</span>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={comingOutForm.supportPerson}
                    onChange={(e) => setComingOutForm({ ...comingOutForm, supportPerson: e.target.value })}
                    className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                    placeholder="Support person (optional)"
                  />

                  <textarea
                    value={comingOutForm.script}
                    onChange={(e) => setComingOutForm({ ...comingOutForm, script: e.target.value })}
                    className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400 min-h-[100px]"
                    placeholder="What you want to say (script/talking points)..."
                  />

                  <textarea
                    value={comingOutForm.notes}
                    onChange={(e) => setComingOutForm({ ...comingOutForm, notes: e.target.value })}
                    className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400 min-h-[80px]"
                    placeholder="Additional notes, concerns, or backup plans..."
                  />

                  <button
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all font-medium"
                  >
                    Add Plan
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {comingOut.length === 0 ? (
                  <div className="col-span-full text-center py-12 bg-gradient-to-br from-blue-900/20 to-indigo-900/20 rounded-xl border border-blue-500/20">
                    <Star className="w-16 h-16 text-blue-400/50 mx-auto mb-4" />
                    <p className="text-blue-200/70">Plan coming out conversations when you're ready</p>
                  </div>
                ) : (
                  comingOut.sort((a, b) => {
                    const statusOrder = { planning: 0, ready: 1, postponed: 2, completed: 3 };
                    return statusOrder[a.status] - statusOrder[b.status];
                  }).map(plan => (
                    <div key={plan.id} className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-xl p-5 border border-blue-500/20 hover:border-blue-400/40 transition-all">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white">{plan.person}</h3>
                          <p className="text-blue-300/70 text-sm">{plan.relationship}</p>
                        </div>
                        <button onClick={() => deleteComingOut(plan.id)} className="p-1 text-red-300 hover:text-red-200">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-2 mb-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-300" />
                          <span className="text-blue-200">
                            {plan.plannedDate ? new Date(plan.plannedDate).toLocaleDateString() : 'No date set'}
                          </span>
                        </div>
                        <div className="text-blue-200">Method: {plan.method}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-blue-300">Safety:</span>
                          <div className="flex-1 bg-black/40 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                plan.safetyLevel >= 4 ? 'bg-green-500' : plan.safetyLevel >= 3 ? 'bg-blue-500' : 'bg-orange-500'
                              }`}
                              style={{ width: `${(plan.safetyLevel / 5) * 100}%` }}
                            />
                          </div>
                          <span className="text-blue-200">{plan.safetyLevel}/5</span>
                        </div>
                        {plan.supportPerson && (
                          <div className="text-blue-200">Support: {plan.supportPerson}</div>
                        )}
                      </div>

                      {plan.script && (
                        <div className="mb-3 p-3 bg-black/20 rounded">
                          <p className="text-blue-300 text-xs font-medium mb-1">Script:</p>
                          <p className="text-blue-200/70 text-sm whitespace-pre-wrap">{plan.script}</p>
                        </div>
                      )}

                      {plan.notes && <p className="text-blue-200/70 text-sm mb-3 italic">{plan.notes}</p>}

                      {plan.status === 'completed' && plan.outcome && (
                        <div className="mb-3 p-3 bg-green-500/10 border border-green-500/30 rounded">
                          <p className="text-green-300 text-xs font-medium mb-1">Outcome:</p>
                          <p className="text-green-200/70 text-sm">{plan.outcome}</p>
                          {plan.actualDate && (
                            <p className="text-green-300/50 text-xs mt-1">{new Date(plan.actualDate).toLocaleDateString()}</p>
                          )}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <select
                          value={plan.status}
                          onChange={(e) => {
                            const newStatus = e.target.value as ComingOutPlan['status'];
                            if (newStatus === 'completed') {
                              const outcome = prompt('How did it go?');
                              if (outcome !== null) {
                                updateComingOutStatus(plan.id, newStatus, outcome);
                              }
                            } else {
                              updateComingOutStatus(plan.id, newStatus);
                            }
                          }}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${getStatusColor(plan.status)}`}
                        >
                          <option value="planning">Planning</option>
                          <option value="ready">Ready</option>
                          <option value="completed">Completed</option>
                          <option value="postponed">Postponed</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
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
}
