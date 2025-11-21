import React, { useState, useEffect } from 'react';
import { Star, Heart, Plus, Filter, Search, Clock, Zap, Brain, Wind, Palette, Users, Shield, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface CopingSkill {
  id: string;
  name: string;
  category: string;
  description: string;
  instructions: string[];
  timeRequired: 'quick' | 'moderate' | 'extended'; // <5min, 5-15min, 15+min
  difficulty: 'easy' | 'medium' | 'advanced';
  helpfulFor: string[]; // anxiety, panic, depression, anger, etc.
  tags: string[];
  isFavorite: boolean;
  userRating?: number; // 1-5
  personalNotes?: string;
  timesUsed: number;
  isCustom: boolean;
}

const CopingSkillsLibrary: React.FC = () => {
  const [skills, setSkills] = useState<CopingSkill[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterSituation, setFilterSituation] = useState<string>('all');
  const [filterTime, setFilterTime] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<CopingSkill | null>(null);

  const [formData, setFormData] = useState<Omit<CopingSkill, 'id' | 'isFavorite' | 'timesUsed' | 'isCustom'>>({
    name: '',
    category: 'Grounding',
    description: '',
    instructions: [''],
    timeRequired: 'quick',
    difficulty: 'easy',
    helpfulFor: [],
    tags: [],
    personalNotes: '',
  });

  const categories = [
    { id: 'Grounding', icon: Shield, color: 'purple' },
    { id: 'Breathing', icon: Wind, color: 'blue' },
    { id: 'Cognitive', icon: Brain, color: 'indigo' },
    { id: 'Physical', icon: Zap, color: 'orange' },
    { id: 'Creative', icon: Palette, color: 'pink' },
    { id: 'Social', icon: Users, color: 'green' },
    { id: 'Sensory', icon: Star, color: 'yellow' },
  ];

  const situations = [
    'Anxiety', 'Panic Attack', 'Depression', 'Anger', 'Overwhelm',
    'Dissociation', 'Flashbacks', 'Insomnia', 'Intrusive Thoughts',
    'Emotional Dysregulation', 'Grief', 'Loneliness', 'Stress'
  ];

  const defaultSkills: CopingSkill[] = [
    {
      id: 'skill_1',
      name: '5-4-3-2-1 Grounding',
      category: 'Grounding',
      description: 'A sensory grounding technique that brings you back to the present moment by engaging all five senses.',
      instructions: [
        'Name 5 things you can see around you',
        'Name 4 things you can touch (and touch them)',
        'Name 3 things you can hear',
        'Name 2 things you can smell (or like to smell)',
        'Name 1 thing you can taste',
        'Take a deep breath and notice how you feel now'
      ],
      timeRequired: 'quick',
      difficulty: 'easy',
      helpfulFor: ['Anxiety', 'Panic Attack', 'Dissociation', 'Overwhelm'],
      tags: ['sensory', 'grounding', 'quick-relief', 'beginner-friendly'],
      isFavorite: false,
      timesUsed: 0,
      isCustom: false,
    },
    {
      id: 'skill_2',
      name: 'Box Breathing',
      category: 'Breathing',
      description: 'A rhythmic breathing pattern that activates the parasympathetic nervous system to reduce stress and anxiety.',
      instructions: [
        'Breathe in through your nose for 4 counts',
        'Hold your breath for 4 counts',
        'Breathe out through your mouth for 4 counts',
        'Hold for 4 counts',
        'Repeat 4-5 times or until you feel calmer'
      ],
      timeRequired: 'quick',
      difficulty: 'easy',
      helpfulFor: ['Anxiety', 'Panic Attack', 'Stress', 'Anger'],
      tags: ['breathing', 'quick-relief', 'evidence-based', 'beginner-friendly'],
      isFavorite: false,
      timesUsed: 0,
      isCustom: false,
    },
    {
      id: 'skill_3',
      name: 'Progressive Muscle Relaxation',
      category: 'Physical',
      description: 'Systematically tense and release muscle groups to reduce physical tension and promote relaxation.',
      instructions: [
        'Sit or lie in a comfortable position',
        'Starting with your feet, tense the muscles tightly for 5 seconds',
        'Release the tension and notice the feeling of relaxation',
        'Move up to your calves, then thighs, abdomen, chest, hands, arms, shoulders, neck, and face',
        'Spend 10-15 seconds relaxing each muscle group before moving to the next',
        'Take a few deep breaths when finished'
      ],
      timeRequired: 'moderate',
      difficulty: 'easy',
      helpfulFor: ['Anxiety', 'Stress', 'Insomnia', 'Physical Tension'],
      tags: ['physical', 'relaxation', 'evidence-based', 'full-body'],
      isFavorite: false,
      timesUsed: 0,
      isCustom: false,
    },
    {
      id: 'skill_4',
      name: 'Thought Challenging',
      category: 'Cognitive',
      description: 'Identify and challenge unhelpful thoughts using cognitive behavioral therapy techniques.',
      instructions: [
        'Write down the thought that is bothering you',
        'Identify the emotion it creates (e.g., anxiety, sadness)',
        'Look for thinking errors (catastrophizing, all-or-nothing, mind reading, etc.)',
        'Ask yourself: What evidence supports this thought? What evidence contradicts it?',
        'Consider: What would I tell a friend having this thought?',
        'Create a more balanced, realistic thought',
        'Notice how the new thought changes your emotional response'
      ],
      timeRequired: 'moderate',
      difficulty: 'medium',
      helpfulFor: ['Anxiety', 'Depression', 'Intrusive Thoughts', 'Negative Self-Talk'],
      tags: ['cognitive', 'CBT', 'evidence-based', 'journaling'],
      isFavorite: false,
      timesUsed: 0,
      isCustom: false,
    },
    {
      id: 'skill_5',
      name: 'Cold Water Immersion',
      category: 'Physical',
      description: 'Use cold temperature to activate the dive reflex and quickly calm the nervous system.',
      instructions: [
        'Fill a bowl with very cold water and add ice if available',
        'Hold your breath and submerge your face for 15-30 seconds',
        'Alternatively, hold an ice pack or cold cloth on your face',
        'Focus on the cold sensation',
        'Repeat 2-3 times if needed',
        'This technique activates the vagus nerve and can interrupt panic'
      ],
      timeRequired: 'quick',
      difficulty: 'medium',
      helpfulFor: ['Panic Attack', 'Emotional Dysregulation', 'Intense Anger', 'Self-Harm Urges'],
      tags: ['physical', 'crisis-intervention', 'DBT', 'intense-emotions'],
      isFavorite: false,
      timesUsed: 0,
      isCustom: false,
    },
    {
      id: 'skill_6',
      name: 'Creative Expression',
      category: 'Creative',
      description: 'Use art, writing, or music to process and express difficult emotions.',
      instructions: [
        'Choose your medium: drawing, painting, writing, music, etc.',
        'Set a timer for 10-20 minutes',
        'Create without judgment - this is not about making something "good"',
        'Let your emotions guide what you create',
        'Use colors, shapes, words, or sounds that represent how you feel',
        'When finished, reflect: How do you feel now? What did you discover?'
      ],
      timeRequired: 'extended',
      difficulty: 'easy',
      helpfulFor: ['Depression', 'Grief', 'Overwhelm', 'Processing Emotions'],
      tags: ['creative', 'expression', 'processing', 'art-therapy'],
      isFavorite: false,
      timesUsed: 0,
      isCustom: false,
    },
    {
      id: 'skill_7',
      name: 'Reach Out for Support',
      category: 'Social',
      description: 'Connect with a trusted person for support, validation, or distraction.',
      instructions: [
        'Identify who is available and safe to reach out to',
        'Decide what you need: to talk, distraction, practical help, or just company',
        'Text, call, or video chat with them',
        'Be honest about what you need: "I\'m struggling and need to talk" or "Can we watch something together?"',
        'Remember: asking for help is a strength, not a weakness',
        'If no one is available, text a crisis line: Text HOME to 741741'
      ],
      timeRequired: 'moderate',
      difficulty: 'medium',
      helpfulFor: ['Loneliness', 'Depression', 'Anxiety', 'Suicidal Thoughts', 'Grief'],
      tags: ['social', 'connection', 'crisis-support', 'relationships'],
      isFavorite: false,
      timesUsed: 0,
      isCustom: false,
    },
    {
      id: 'skill_8',
      name: 'Sensory Grounding Kit',
      category: 'Sensory',
      description: 'Engage your senses with comforting items to ground yourself in the present.',
      instructions: [
        'Gather items that engage each sense: soft fabric, essential oils, sour candy, calming music, photos',
        'When overwhelmed, take out your kit',
        'Slowly engage with each item, focusing on the sensory experience',
        'Notice textures, smells, tastes, sounds, and sights',
        'Breathe deeply as you engage with each sense',
        'Spend as long as you need until you feel more grounded'
      ],
      timeRequired: 'moderate',
      difficulty: 'easy',
      helpfulFor: ['Anxiety', 'Dissociation', 'Panic Attack', 'Flashbacks', 'Overwhelm'],
      tags: ['sensory', 'grounding', 'tactile', 'self-soothing'],
      isFavorite: false,
      timesUsed: 0,
      isCustom: false,
    },
    {
      id: 'skill_9',
      name: '4-7-8 Breathing',
      category: 'Breathing',
      description: 'A calming breath pattern that promotes relaxation and can help with sleep.',
      instructions: [
        'Exhale completely through your mouth',
        'Close your mouth and inhale quietly through your nose for 4 counts',
        'Hold your breath for 7 counts',
        'Exhale completely through your mouth for 8 counts',
        'This completes one cycle - repeat 3-4 times',
        'Use this technique before bed or when you need to calm down quickly'
      ],
      timeRequired: 'quick',
      difficulty: 'easy',
      helpfulFor: ['Anxiety', 'Insomnia', 'Stress', 'Racing Thoughts'],
      tags: ['breathing', 'sleep', 'quick-relief', 'evidence-based'],
      isFavorite: false,
      timesUsed: 0,
      isCustom: false,
    },
    {
      id: 'skill_10',
      name: 'Body Scan Meditation',
      category: 'Grounding',
      description: 'A mindfulness practice that brings awareness to physical sensations throughout the body.',
      instructions: [
        'Lie down or sit comfortably',
        'Close your eyes and take a few deep breaths',
        'Starting at your toes, notice any sensations - warmth, coolness, tingling, tension',
        'Slowly move your attention up through your feet, legs, hips, abdomen, chest, arms, hands, neck, and head',
        'Don\'t try to change anything - just observe',
        'If your mind wanders, gently bring it back to the body part you\'re focused on',
        'Take 10-20 minutes for a full scan'
      ],
      timeRequired: 'extended',
      difficulty: 'medium',
      helpfulFor: ['Anxiety', 'Insomnia', 'Dissociation', 'Chronic Pain'],
      tags: ['mindfulness', 'meditation', 'body-awareness', 'grounding'],
      isFavorite: false,
      timesUsed: 0,
      isCustom: false,
    },
  ];

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = () => {
    const saved = localStorage.getItem('coping_skills');
    if (saved) {
      setSkills(JSON.parse(saved));
    } else {
      setSkills(defaultSkills);
      localStorage.setItem('coping_skills', JSON.stringify(defaultSkills));
    }
  };

  const saveSkills = (data: CopingSkill[]) => {
    setSkills(data);
    localStorage.setItem('coping_skills', JSON.stringify(data));
  };

  const toggleFavorite = (id: string) => {
    const updated = skills.map(s => s.id === id ? { ...s, isFavorite: !s.isFavorite } : s);
    saveSkills(updated);
  };

  const updateRating = (id: string, rating: number) => {
    const updated = skills.map(s => s.id === id ? { ...s, userRating: rating } : s);
    saveSkills(updated);
    toast.success('Rating saved');
  };

  const incrementUsage = (id: string) => {
    const updated = skills.map(s => s.id === id ? { ...s, timesUsed: s.timesUsed + 1 } : s);
    saveSkills(updated);
  };

  const addCustomSkill = () => {
    if (!formData.name.trim()) {
      toast.error('Skill name is required');
      return;
    }

    const newSkill: CopingSkill = {
      ...formData,
      id: `custom_${Date.now()}`,
      isFavorite: false,
      timesUsed: 0,
      isCustom: true,
    };

    saveSkills([...skills, newSkill]);
    toast.success('Custom skill added');
    setShowAddForm(false);
    resetForm();
  };

  const deleteSkill = (id: string) => {
    saveSkills(skills.filter(s => s.id !== id));
    toast.success('Skill deleted');
    setSelectedSkill(null);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Grounding',
      description: '',
      instructions: [''],
      timeRequired: 'quick',
      difficulty: 'easy',
      helpfulFor: [],
      tags: [],
      personalNotes: '',
    });
  };

  const getFilteredSkills = () => {
    return skills.filter(skill => {
      const matchesSearch = !searchTerm ||
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = filterCategory === 'all' || skill.category === filterCategory;
      const matchesSituation = filterSituation === 'all' || skill.helpfulFor.includes(filterSituation);
      const matchesTime = filterTime === 'all' || skill.timeRequired === filterTime;
      const matchesFavorites = !showFavoritesOnly || skill.isFavorite;

      return matchesSearch && matchesCategory && matchesSituation && matchesTime && matchesFavorites;
    });
  };

  const getCategoryStyle = (category: string) => {
    const cat = categories.find(c => c.id === category);
    if (!cat) return { color: 'purple', icon: Shield };
    return cat;
  };

  const getTimeLabel = (time: string) => {
    if (time === 'quick') return '< 5 min';
    if (time === 'moderate') return '5-15 min';
    return '15+ min';
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Coping Skills Library</h2>
          <p className="text-purple-300">Evidence-based techniques for managing difficult moments</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Custom Skill
        </button>
      </div>

      {/* Filters */}
      <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/30 mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search skills..."
            className="w-full pl-10 pr-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200 placeholder-purple-500"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filterCategory === 'all'
                ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                : 'bg-purple-900/20 text-purple-400 hover:bg-purple-500/20'
            }`}
          >
            All Categories
          </button>
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  filterCategory === cat.id
                    ? `bg-${cat.color}-500/30 text-${cat.color}-300 border border-${cat.color}-500/50`
                    : 'bg-purple-900/20 text-purple-400 hover:bg-purple-500/20'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.id}
              </button>
            );
          })}
        </div>

        {/* Situation & Time Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <select
            value={filterSituation}
            onChange={(e) => setFilterSituation(e.target.value)}
            className="px-3 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200"
          >
            <option value="all">All Situations</option>
            {situations.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            value={filterTime}
            onChange={(e) => setFilterTime(e.target.value)}
            className="px-3 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200"
          >
            <option value="all">Any Duration</option>
            <option value="quick">Quick (&lt; 5 min)</option>
            <option value="moderate">Moderate (5-15 min)</option>
            <option value="extended">Extended (15+ min)</option>
          </select>

          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              showFavoritesOnly
                ? 'bg-pink-500/30 text-pink-300 border border-pink-500/50'
                : 'bg-purple-900/20 text-purple-400 hover:bg-purple-500/20'
            }`}
          >
            <Heart className="w-4 h-4 inline mr-2" />
            Favorites Only
          </button>

          <div className="bg-purple-900/30 px-4 py-2 rounded-lg border border-purple-500/30 flex items-center justify-center">
            <span className="text-purple-300 font-semibold">
              {getFilteredSkills().length} skills
            </span>
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {getFilteredSkills().map(skill => {
          const catStyle = getCategoryStyle(skill.category);
          const Icon = catStyle.icon;

          return (
            <div
              key={skill.id}
              className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-6 rounded-xl border border-purple-500/30 transition-all hover:border-purple-400/50 cursor-pointer"
              onClick={() => setSelectedSkill(skill)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <Icon className={`w-6 h-6 text-${catStyle.color}-400`} />
                  <div>
                    <h3 className="text-xl font-bold text-white">{skill.name}</h3>
                    <p className="text-sm text-purple-400">{skill.category}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(skill.id); }}
                  className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-all"
                >
                  <Heart
                    className={`w-5 h-5 ${skill.isFavorite ? 'text-pink-400 fill-pink-400' : 'text-purple-400'}`}
                  />
                </button>
              </div>

              <p className="text-purple-200 text-sm mb-4">{skill.description}</p>

              <div className="flex items-center gap-3 text-xs text-purple-400 mb-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {getTimeLabel(skill.timeRequired)}
                </span>
                <span className="capitalize">{skill.difficulty}</span>
                <span>Used {skill.timesUsed}x</span>
              </div>

              {skill.helpfulFor.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {skill.helpfulFor.slice(0, 3).map((situation, i) => (
                    <span key={i} className="bg-blue-900/30 text-blue-300 px-2 py-1 rounded-full text-xs">
                      {situation}
                    </span>
                  ))}
                  {skill.helpfulFor.length > 3 && (
                    <span className="text-purple-400 text-xs">+{skill.helpfulFor.length - 3} more</span>
                  )}
                </div>
              )}

              {/* Rating */}
              <div className="flex items-center gap-1 mt-3">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    onClick={(e) => { e.stopPropagation(); updateRating(skill.id, rating); }}
                    className="transition-all hover:scale-110"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        (skill.userRating || 0) >= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {getFilteredSkills().length === 0 && (
          <div className="col-span-2 text-center py-12 text-purple-400">
            <Shield className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No coping skills match your filters</p>
          </div>
        )}
      </div>

      {/* Skill Detail Modal */}
      {selectedSkill && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gradient-to-br from-purple-900/95 to-indigo-900/95 p-8 rounded-2xl border border-purple-500/50 max-w-3xl w-full my-8 backdrop-blur-sm">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">{selectedSkill.name}</h2>
                <p className="text-purple-300">{selectedSkill.category}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleFavorite(selectedSkill.id)}
                  className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-all"
                >
                  <Heart className={`w-6 h-6 ${selectedSkill.isFavorite ? 'text-pink-400 fill-pink-400' : 'text-purple-400'}`} />
                </button>
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all"
                >
                  <X className="w-6 h-6 text-red-300" />
                </button>
              </div>
            </div>

            <p className="text-purple-200 text-lg mb-6">{selectedSkill.description}</p>

            <div className="bg-purple-900/20 p-6 rounded-xl mb-6">
              <h3 className="text-xl font-bold text-purple-300 mb-4">Instructions</h3>
              <ol className="space-y-3">
                {selectedSkill.instructions.map((instruction, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-500/30 rounded-full flex items-center justify-center text-purple-300 text-sm font-bold">
                      {i + 1}
                    </span>
                    <span className="text-purple-200 flex-1">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-900/20 p-4 rounded-lg">
                <p className="text-blue-300 text-sm mb-2">Time Required</p>
                <p className="text-white font-semibold">{getTimeLabel(selectedSkill.timeRequired)}</p>
              </div>
              <div className="bg-green-900/20 p-4 rounded-lg">
                <p className="text-green-300 text-sm mb-2">Difficulty</p>
                <p className="text-white font-semibold capitalize">{selectedSkill.difficulty}</p>
              </div>
            </div>

            {selectedSkill.helpfulFor.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-bold text-purple-300 mb-3">Helpful For:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSkill.helpfulFor.map((situation, i) => (
                    <span key={i} className="bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-sm">
                      {situation}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  incrementUsage(selectedSkill.id);
                  toast.success(`"${selectedSkill.name}" marked as used`);
                }}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-bold transition-all"
              >
                I Used This Skill
              </button>
              {selectedSkill.isCustom && (
                <button
                  onClick={() => deleteSkill(selectedSkill.id)}
                  className="px-6 py-4 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl font-semibold transition-all"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Skill Form - Simplified */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gradient-to-br from-purple-900/95 to-indigo-900/95 p-8 rounded-2xl border border-purple-500/50 max-w-2xl w-full my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Add Custom Coping Skill</h3>
              <button onClick={() => { setShowAddForm(false); resetForm(); }} className="p-2 bg-red-500/20 rounded-lg">
                <X className="w-6 h-6 text-red-300" />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Skill name *"
                className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200"
              />

              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200"
              >
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.id}</option>)}
              </select>

              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description"
                rows={3}
                className="w-full px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-200"
              />

              <div className="flex gap-3">
                <button onClick={addCustomSkill} className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold">
                  Add Skill
                </button>
                <button onClick={() => { setShowAddForm(false); resetForm(); }} className="px-6 py-4 bg-purple-900/30 text-purple-300 rounded-xl font-semibold">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CopingSkillsLibrary;
