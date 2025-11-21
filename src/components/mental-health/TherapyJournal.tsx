import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Download, X, Eye, EyeOff, CheckCircle, Clock, Video, User } from 'lucide-react';
import toast from 'react-hot-toast';

interface TherapySession {
  id: string;
  therapistName: string;
  sessionDate: string;
  sessionTime: string;
  modality: 'in-person' | 'telehealth' | 'phone';
  sessionNumber?: number;

  // Pre-session
  prepTopics: string[];
  prepGoals: string[];
  prepConcerns: string[];
  prepQuestions: string[];

  // Post-session
  topicsCovered: string[];
  keyInsights: string[];
  breakthroughs: string[];
  homework: string[];
  actionItems: string[];
  therapistRecommendations: string[];
  nextSessionPlan: string;

  // Ratings & Reflection
  sessionHelpfulness: number; // 1-10
  emotionalState: 'better' | 'same' | 'worse';
  followUpNeeded: boolean;
  notes: string;

  completed: boolean;
  timestamp: number;
}

const TherapyJournal: React.FC = () => {
  const [sessions, setSessions] = useState<TherapySession[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editMode, setEditMode] = useState<'prep' | 'post' | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [filterView, setFilterView] = useState<'all' | 'upcoming' | 'completed'>('all');

  const [formData, setFormData] = useState<Omit<TherapySession, 'id' | 'timestamp'>>({
    therapistName: '',
    sessionDate: new Date().toISOString().split('T')[0],
    sessionTime: '',
    modality: 'telehealth',
    sessionNumber: undefined,
    prepTopics: [],
    prepGoals: [],
    prepConcerns: [],
    prepQuestions: [],
    topicsCovered: [],
    keyInsights: [],
    breakthroughs: [],
    homework: [],
    actionItems: [],
    therapistRecommendations: [],
    nextSessionPlan: '',
    sessionHelpfulness: 5,
    emotionalState: 'same',
    followUpNeeded: false,
    notes: '',
    completed: false,
  });

  const commonTopics = [
    'Anxiety', 'Depression', 'Trauma', 'Relationships', 'Family Issues',
    'Work/Career', 'Self-Esteem', 'Grief/Loss', 'Coping Skills', 'Boundaries',
    'Medication Management', 'Sleep', 'Stress Management', 'Life Transitions',
    'Identity', 'Chronic Illness', 'Pain Management', 'Communication Skills'
  ];

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    const saved = localStorage.getItem('therapy_journal');
    if (saved) {
      setSessions(JSON.parse(saved));
    }
  };

  const saveSessions = (data: TherapySession[]) => {
    setSessions(data);
    localStorage.setItem('therapy_journal', JSON.stringify(data));
  };

  const addSession = () => {
    if (!formData.therapistName || !formData.sessionDate) {
      toast.error('Therapist name and session date are required');
      return;
    }

    const newSession: TherapySession = {
      ...formData,
      id: `session_${Date.now()}`,
      timestamp: new Date(`${formData.sessionDate}T${formData.sessionTime || '00:00'}`).getTime(),
    };

    saveSessions([...sessions, newSession].sort((a, b) => b.timestamp - a.timestamp));
    toast.success('Session added');
    setShowAddForm(false);
    resetForm();
  };

  const updateSession = (id: string, updates: Partial<TherapySession>) => {
    const updated = sessions.map(s => s.id === id ? { ...s, ...updates } : s);
    saveSessions(updated);
    toast.success('Session updated');
  };

  const deleteSession = (id: string) => {
    saveSessions(sessions.filter(s => s.id !== id));
    toast.success('Session deleted');
  };

  const resetForm = () => {
    setFormData({
      therapistName: '',
      sessionDate: new Date().toISOString().split('T')[0],
      sessionTime: '',
      modality: 'telehealth',
      sessionNumber: undefined,
      prepTopics: [],
      prepGoals: [],
      prepConcerns: [],
      prepQuestions: [],
      topicsCovered: [],
      keyInsights: [],
      breakthroughs: [],
      homework: [],
      actionItems: [],
      therapistRecommendations: [],
      nextSessionPlan: '',
      sessionHelpfulness: 5,
      emotionalState: 'same',
      followUpNeeded: false,
      notes: '',
      completed: false,
    });
    setEditMode(null);
    setEditingId(null);
  };

  const addToList = (list: keyof TherapySession, item: string, sessionId?: string) => {
    if (sessionId) {
      // Update existing session
      const session = sessions.find(s => s.id === sessionId);
      if (session) {
        const currentList = session[list] as string[];
        if (!currentList.includes(item)) {
          updateSession(sessionId, { [list]: [...currentList, item] });
        }
      }
    } else {
      // Update form data
      const currentList = formData[list] as string[];
      if (item && !currentList.includes(item)) {
        setFormData({ ...formData, [list]: [...currentList, item] });
      }
    }
  };

  const removeFromList = (list: keyof TherapySession, item: string, sessionId?: string) => {
    if (sessionId) {
      const session = sessions.find(s => s.id === sessionId);
      if (session) {
        const currentList = session[list] as string[];
        updateSession(sessionId, { [list]: currentList.filter(i => i !== item) });
      }
    } else {
      const currentList = formData[list] as string[];
      setFormData({ ...formData, [list]: currentList.filter(i => i !== item) });
    }
  };

  const markCompleted = (id: string) => {
    updateSession(id, { completed: true });
  };

  const getFilteredSessions = () => {
    const now = Date.now();
    return sessions.filter(session => {
      if (filterView === 'upcoming') return session.timestamp >= now && !session.completed;
      if (filterView === 'completed') return session.completed;
      return true;
    });
  };

  const exportSession = (session: TherapySession) => {
    let content = `THERAPY SESSION NOTES\n`;
    content += `=`.repeat(80) + '\n\n';
    content += `Therapist: ${session.therapistName}\n`;
    content += `Date: ${new Date(session.timestamp).toLocaleString()}\n`;
    content += `Modality: ${session.modality}\n`;
    if (session.sessionNumber) content += `Session #: ${session.sessionNumber}\n`;
    content += `\n`;

    if (session.prepTopics.length > 0) {
      content += `PRE-SESSION PREP:\n`;
      content += `\nTopics to Discuss:\n`;
      session.prepTopics.forEach(topic => content += `  • ${topic}\n`);
    }

    if (session.prepGoals.length > 0) {
      content += `\nGoals for Session:\n`;
      session.prepGoals.forEach(goal => content += `  • ${goal}\n`);
    }

    if (session.prepConcerns.length > 0) {
      content += `\nConcerns:\n`;
      session.prepConcerns.forEach(concern => content += `  • ${concern}\n`);
    }

    if (session.prepQuestions.length > 0) {
      content += `\nQuestions to Ask:\n`;
      session.prepQuestions.forEach(q => content += `  • ${q}\n`);
    }

    if (session.completed) {
      content += `\n${`-`.repeat(80)}\n\n`;
      content += `POST-SESSION REFLECTION:\n\n`;

      content += `Session Helpfulness: ${session.sessionHelpfulness}/10\n`;
      content += `Emotional State After: ${session.emotionalState}\n\n`;

      if (session.topicsCovered.length > 0) {
        content += `Topics Covered:\n`;
        session.topicsCovered.forEach(topic => content += `  • ${topic}\n`);
        content += `\n`;
      }

      if (session.keyInsights.length > 0) {
        content += `Key Insights:\n`;
        session.keyInsights.forEach(insight => content += `  • ${insight}\n`);
        content += `\n`;
      }

      if (session.breakthroughs.length > 0) {
        content += `Breakthroughs:\n`;
        session.breakthroughs.forEach(b => content += `  • ${b}\n`);
        content += `\n`;
      }

      if (session.homework.length > 0) {
        content += `Homework/Practice:\n`;
        session.homework.forEach(hw => content += `  • ${hw}\n`);
        content += `\n`;
      }

      if (session.actionItems.length > 0) {
        content += `Action Items:\n`;
        session.actionItems.forEach(item => content += `  • ${item}\n`);
        content += `\n`;
      }

      if (session.therapistRecommendations.length > 0) {
        content += `Therapist Recommendations:\n`;
        session.therapistRecommendations.forEach(rec => content += `  • ${rec}\n`);
        content += `\n`;
      }

      if (session.nextSessionPlan) {
        content += `Plan for Next Session:\n${session.nextSessionPlan}\n\n`;
      }
    }

    if (session.notes) {
      content += `\nAdditional Notes:\n${session.notes}\n`;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `therapy-session-${session.sessionDate}.txt`;
    a.click();
    toast.success('Session exported');
  };

  const getModalityIcon = (modality: string) => {
    if (modality === 'telehealth') return Video;
    if (modality === 'phone') return Clock;
    return User;
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Therapy Journal</h2>
          <p className="text-purple-300">Prepare for sessions and track your therapeutic journey</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all"
        >
          <Plus className="w-5 h-5" />
          New Session
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-purple-900/20 p-2 rounded-xl border border-purple-500/30 mb-6">
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'All Sessions' },
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'completed', label: 'Completed' },
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setFilterView(filter.id as any)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filterView === filter.id
                  ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                  : 'bg-purple-900/20 text-purple-400 hover:bg-purple-500/20'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {getFilteredSessions().length === 0 ? (
          <div className="text-center py-12 text-purple-400">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No therapy sessions found</p>
          </div>
        ) : (
          getFilteredSessions().map(session => {
            const ModalityIcon = getModalityIcon(session.modality);
            const isPast = session.timestamp < Date.now();

            return (
              <div
                key={session.id}
                className={`p-6 rounded-xl border transition-all ${
                  session.completed
                    ? 'bg-green-900/20 border-green-500/30'
                    : isPast
                    ? 'bg-orange-900/20 border-orange-500/30'
                    : 'bg-purple-900/20 border-purple-500/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <ModalityIcon className="w-6 h-6 text-purple-400" />
                      <h3 className="text-2xl font-bold text-white">{session.therapistName}</h3>
                      {session.sessionNumber && (
                        <span className="bg-purple-500/20 px-3 py-1 rounded-full text-purple-300 text-sm">
                          Session #{session.sessionNumber}
                        </span>
                      )}
                      {session.completed && (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-purple-300 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(session.timestamp).toLocaleDateString()}
                      </span>
                      {session.sessionTime && <span>{session.sessionTime}</span>}
                      <span className="capitalize">{session.modality}</span>
                    </div>

                    {/* Quick Preview */}
                    {!session.completed && session.prepTopics.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm text-purple-400 mb-1">Topics to discuss:</p>
                        <div className="flex flex-wrap gap-2">
                          {session.prepTopics.slice(0, 3).map((topic, i) => (
                            <span key={i} className="bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-sm">
                              {topic}
                            </span>
                          ))}
                          {session.prepTopics.length > 3 && (
                            <span className="text-purple-400 text-sm">+{session.prepTopics.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    )}

                    {session.completed && session.sessionHelpfulness && (
                      <div className="mb-3">
                        <span className="text-sm text-purple-400">Helpfulness: </span>
                        <span className="text-lg font-bold text-purple-200">{session.sessionHelpfulness}/10</span>
                        <span className="ml-4 text-sm">
                          Feeling: <span className="capitalize text-purple-300">{session.emotionalState}</span>
                        </span>
                      </div>
                    )}

                    {/* Expanded Details */}
                    {expandedSession === session.id && (
                      <div className="mt-4 space-y-4 border-t border-purple-500/30 pt-4">
                        {/* Pre-Session Prep */}
                        {(session.prepGoals.length > 0 || session.prepConcerns.length > 0 || session.prepQuestions.length > 0) && (
                          <div className="bg-blue-900/20 p-4 rounded-lg">
                            <h4 className="text-lg font-bold text-blue-300 mb-3">Pre-Session Prep</h4>

                            {session.prepGoals.length > 0 && (
                              <div className="mb-3">
                                <p className="text-sm font-semibold text-blue-300 mb-2">Goals:</p>
                                <ul className="list-disc list-inside text-blue-200 space-y-1">
                                  {session.prepGoals.map((goal, i) => <li key={i}>{goal}</li>)}
                                </ul>
                              </div>
                            )}

                            {session.prepConcerns.length > 0 && (
                              <div className="mb-3">
                                <p className="text-sm font-semibold text-blue-300 mb-2">Concerns:</p>
                                <ul className="list-disc list-inside text-blue-200 space-y-1">
                                  {session.prepConcerns.map((concern, i) => <li key={i}>{concern}</li>)}
                                </ul>
                              </div>
                            )}

                            {session.prepQuestions.length > 0 && (
                              <div>
                                <p className="text-sm font-semibold text-blue-300 mb-2">Questions:</p>
                                <ul className="list-disc list-inside text-blue-200 space-y-1">
                                  {session.prepQuestions.map((q, i) => <li key={i}>{q}</li>)}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Post-Session Reflection */}
                        {session.completed && (
                          <div className="bg-green-900/20 p-4 rounded-lg">
                            <h4 className="text-lg font-bold text-green-300 mb-3">Post-Session Reflection</h4>

                            {session.topicsCovered.length > 0 && (
                              <div className="mb-3">
                                <p className="text-sm font-semibold text-green-300 mb-2">Topics Covered:</p>
                                <div className="flex flex-wrap gap-2">
                                  {session.topicsCovered.map((topic, i) => (
                                    <span key={i} className="bg-green-900/30 text-green-300 px-3 py-1 rounded-full text-sm">
                                      {topic}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {session.keyInsights.length > 0 && (
                              <div className="mb-3">
                                <p className="text-sm font-semibold text-green-300 mb-2">Key Insights:</p>
                                <ul className="list-disc list-inside text-green-200 space-y-1">
                                  {session.keyInsights.map((insight, i) => <li key={i}>{insight}</li>)}
                                </ul>
                              </div>
                            )}

                            {session.homework.length > 0 && (
                              <div className="mb-3">
                                <p className="text-sm font-semibold text-green-300 mb-2">Homework/Practice:</p>
                                <ul className="list-disc list-inside text-green-200 space-y-1">
                                  {session.homework.map((hw, i) => <li key={i}>{hw}</li>)}
                                </ul>
                              </div>
                            )}

                            {session.nextSessionPlan && (
                              <div>
                                <p className="text-sm font-semibold text-green-300 mb-2">Next Session Plan:</p>
                                <p className="text-green-200">{session.nextSessionPlan}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {session.notes && (
                          <div className="bg-purple-900/20 p-4 rounded-lg">
                            <p className="text-sm font-semibold text-purple-300 mb-2">Notes:</p>
                            <p className="text-purple-200">{session.notes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => exportSession(session)}
                      className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-all"
                      title="Export"
                    >
                      <Download className="w-5 h-5 text-blue-300" />
                    </button>
                    {!session.completed && isPast && (
                      <button
                        onClick={() => markCompleted(session.id)}
                        className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-all"
                        title="Mark Complete"
                      >
                        <CheckCircle className="w-5 h-5 text-green-300" />
                      </button>
                    )}
                    <button
                      onClick={() => setExpandedSession(expandedSession === session.id ? null : session.id)}
                      className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-all"
                    >
                      {expandedSession === session.id ? (
                        <EyeOff className="w-5 h-5 text-purple-300" />
                      ) : (
                        <Eye className="w-5 h-5 text-purple-300" />
                      )}
                    </button>
                    <button
                      onClick={() => deleteSession(session.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all"
                    >
                      <X className="w-5 h-5 text-red-300" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add/Edit Form Modal - Simplified for space */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 p-8 rounded-2xl border border-purple-500/50 max-w-3xl w-full my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">New Therapy Session</h3>
              <button
                onClick={() => { setShowAddForm(false); resetForm(); }}
                className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all"
              >
                <X className="w-6 h-6 text-red-300" />
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-300 mb-2 font-semibold">Therapist Name *</label>
                  <input
                    type="text"
                    value={formData.therapistName}
                    onChange={(e) => setFormData({ ...formData, therapistName: e.target.value })}
                    className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200"
                  />
                </div>
                <div>
                  <label className="block text-purple-300 mb-2 font-semibold">Session Number</label>
                  <input
                    type="number"
                    value={formData.sessionNumber || ''}
                    onChange={(e) => setFormData({ ...formData, sessionNumber: Number(e.target.value) || undefined })}
                    className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-purple-300 mb-2 font-semibold">Date *</label>
                  <input
                    type="date"
                    value={formData.sessionDate}
                    onChange={(e) => setFormData({ ...formData, sessionDate: e.target.value })}
                    className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200"
                  />
                </div>
                <div>
                  <label className="block text-purple-300 mb-2 font-semibold">Time</label>
                  <input
                    type="time"
                    value={formData.sessionTime}
                    onChange={(e) => setFormData({ ...formData, sessionTime: e.target.value })}
                    className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200"
                  />
                </div>
                <div>
                  <label className="block text-purple-300 mb-2 font-semibold">Modality</label>
                  <select
                    value={formData.modality}
                    onChange={(e) => setFormData({ ...formData, modality: e.target.value as any })}
                    className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200"
                  >
                    <option value="telehealth">Telehealth</option>
                    <option value="in-person">In-Person</option>
                    <option value="phone">Phone</option>
                  </select>
                </div>
              </div>

              {/* Pre-Session Prep */}
              <div className="bg-blue-900/20 p-4 rounded-lg space-y-3">
                <h4 className="text-lg font-bold text-blue-300">Pre-Session Prep (Optional)</h4>

                <div>
                  <label className="block text-blue-300 mb-2">Topics to Discuss</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {commonTopics.map(topic => (
                      <button
                        key={topic}
                        onClick={() => addToList('prepTopics', topic)}
                        className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-full text-sm"
                      >
                        + {topic}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-purple-300 mb-2 font-semibold">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={addSession}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-bold transition-all"
              >
                Add Session
              </button>
              <button
                onClick={() => { setShowAddForm(false); resetForm(); }}
                className="px-6 py-4 bg-purple-900/30 hover:bg-purple-900/50 text-purple-300 rounded-xl font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TherapyJournal;
