import React, { useState, useMemo, useCallback } from 'react';

interface Feature {
  id: string;
  name: string;
  description: string;
  category: 'Wellness' | 'Creative' | 'Productivity' | 'Social' | 'Gaming' | 'AI';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  impact: 'Low' | 'Medium' | 'High';
  icon: string;
}

interface QueuedFeature extends Feature {
  queuedAt: number;
}

interface EvolutionLogEntry {
  id: string;
  feature: Feature;
  timestamp: number;
}

const FEATURE_DATABASE: Feature[] = [
  // Wellness Category
  {
    id: 'wellness-1',
    name: 'Symptom Tracker Pro',
    description: 'Track daily symptoms with pattern detection and timeline visualization',
    category: 'Wellness',
    difficulty: 'Medium',
    impact: 'High',
    icon: '🩺',
  },
  {
    id: 'wellness-2',
    name: 'Smart Medication Reminders',
    description: 'AI-powered medication scheduling with refill alerts',
    category: 'Wellness',
    difficulty: 'Medium',
    impact: 'High',
    icon: '💊',
  },
  {
    id: 'wellness-3',
    name: 'Spoon Theory Calculator',
    description: 'Visual spoon management tool for energy budgeting',
    category: 'Wellness',
    difficulty: 'Easy',
    impact: 'Medium',
    icon: '🥄',
  },
  {
    id: 'wellness-4',
    name: 'Sleep Quality Analyzer',
    description: 'Track sleep patterns and get personalized improvement suggestions',
    category: 'Wellness',
    difficulty: 'Medium',
    impact: 'High',
    icon: '😴',
  },
  {
    id: 'wellness-5',
    name: 'Pain Level Logger',
    description: 'Daily pain tracking with location mapping and trend analysis',
    category: 'Wellness',
    difficulty: 'Easy',
    impact: 'Medium',
    icon: '📊',
  },
  {
    id: 'wellness-6',
    name: 'Water Intake Tracker',
    description: 'Hydration reminders with daily goal achievement badges',
    category: 'Wellness',
    difficulty: 'Easy',
    impact: 'Low',
    icon: '💧',
  },
  {
    id: 'wellness-7',
    name: 'Nutrition Journal Plus',
    description: 'Food logging with macro tracking and allergy warnings',
    category: 'Wellness',
    difficulty: 'Hard',
    impact: 'High',
    icon: '🥗',
  },
  {
    id: 'wellness-8',
    name: 'Menstrual Cycle Companion',
    description: 'Period tracking with mood and symptom correlations',
    category: 'Wellness',
    difficulty: 'Medium',
    impact: 'Medium',
    icon: '📅',
  },

  // Creative Category
  {
    id: 'creative-1',
    name: 'AI Art Prompt Generator',
    description: 'Generate daily art prompts inspired by your mood and interests',
    category: 'Creative',
    difficulty: 'Easy',
    impact: 'Medium',
    icon: '🎨',
  },
  {
    id: 'creative-2',
    name: 'Mood-Based Playlist Builder',
    description: 'Auto-curate music playlists based on your emotional state',
    category: 'Creative',
    difficulty: 'Hard',
    impact: 'High',
    icon: '🎵',
  },
  {
    id: 'creative-3',
    name: 'Journal Prompt Engine',
    description: 'Daily writing prompts with guided reflection questions',
    category: 'Creative',
    difficulty: 'Easy',
    impact: 'Medium',
    icon: '📝',
  },
  {
    id: 'creative-4',
    name: 'Poetry Generator',
    description: 'Create poetry from your journal entries and emotions',
    category: 'Creative',
    difficulty: 'Hard',
    impact: 'Medium',
    icon: '✨',
  },
  {
    id: 'creative-5',
    name: 'Doodle Therapy Canvas',
    description: 'Simple drawing tool with relaxing ambient sounds',
    category: 'Creative',
    difficulty: 'Medium',
    impact: 'Medium',
    icon: '🖌️',
  },
  {
    id: 'creative-6',
    name: 'Story Starter Wheel',
    description: 'Spin the wheel for creative writing inspiration',
    category: 'Creative',
    difficulty: 'Easy',
    impact: 'Low',
    icon: '📖',
  },
  {
    id: 'creative-7',
    name: 'Color Mood Palette',
    description: 'Generate color palettes that match your emotional vibe',
    category: 'Creative',
    difficulty: 'Medium',
    impact: 'Low',
    icon: '🌈',
  },
  {
    id: 'creative-8',
    name: 'Dream Journal Illustrator',
    description: 'Visual dream logging with mood-based backgrounds',
    category: 'Creative',
    difficulty: 'Medium',
    impact: 'Medium',
    icon: '💭',
  },

  // Productivity Category
  {
    id: 'productivity-1',
    name: 'Habit Streak Tracker',
    description: 'Build streaks with visual progress and milestone celebrations',
    category: 'Productivity',
    difficulty: 'Easy',
    impact: 'High',
    icon: '🔥',
  },
  {
    id: 'productivity-2',
    name: 'Daily Affirmation System',
    description: 'Personalized affirmations that adapt to your mood',
    category: 'Productivity',
    difficulty: 'Easy',
    impact: 'Medium',
    icon: '💪',
  },
  {
    id: 'productivity-3',
    name: 'Goal Decomposer',
    description: 'Break large goals into small, manageable micro-tasks',
    category: 'Productivity',
    difficulty: 'Medium',
    impact: 'High',
    icon: '🎯',
  },
  {
    id: 'productivity-4',
    name: 'Focus Timer Pro',
    description: 'Pomodoro-style timer with ambient focus sounds',
    category: 'Productivity',
    difficulty: 'Easy',
    impact: 'Medium',
    icon: '⏱️',
  },
  {
    id: 'productivity-5',
    name: 'Task Priority Matrix',
    description: 'Eisenhower matrix for smart task prioritization',
    category: 'Productivity',
    difficulty: 'Medium',
    impact: 'High',
    icon: '📌',
  },
  {
    id: 'productivity-6',
    name: 'Energy Level Scheduler',
    description: 'Schedule tasks based on your energy patterns',
    category: 'Productivity',
    difficulty: 'Hard',
    impact: 'High',
    icon: '⚡',
  },
  {
    id: 'productivity-7',
    name: 'Procrastination Breaker',
    description: 'Anti-procrastination strategies with accountability partners',
    category: 'Productivity',
    difficulty: 'Medium',
    impact: 'High',
    icon: '🚀',
  },
  {
    id: 'productivity-8',
    name: 'Time Block Visualizer',
    description: 'Calendar-based time blocking with conflict detection',
    category: 'Productivity',
    difficulty: 'Hard',
    impact: 'High',
    icon: '📆',
  },

  // Social Category
  {
    id: 'social-1',
    name: 'Support Circle Manager',
    description: 'Organize and track your support network and communication',
    category: 'Social',
    difficulty: 'Medium',
    impact: 'High',
    icon: '👥',
  },
  {
    id: 'social-2',
    name: 'Gratitude Wall',
    description: 'Collect and share messages of gratitude with loved ones',
    category: 'Social',
    difficulty: 'Easy',
    impact: 'Medium',
    icon: '💝',
  },
  {
    id: 'social-3',
    name: 'Community Challenges',
    description: 'Join group challenges and support other community members',
    category: 'Social',
    difficulty: 'Hard',
    impact: 'High',
    icon: '🏆',
  },
  {
    id: 'social-4',
    name: 'Accountability Partner Matcher',
    description: 'AI-matched accountability partners for goal tracking',
    category: 'Social',
    difficulty: 'Hard',
    impact: 'High',
    icon: '🤝',
  },
  {
    id: 'social-5',
    name: 'Message Scheduler',
    description: 'Schedule thoughtful messages to friends and family',
    category: 'Social',
    difficulty: 'Medium',
    impact: 'Medium',
    icon: '💌',
  },
  {
    id: 'social-6',
    name: 'Birthday & Anniversary Reminder',
    description: 'Never miss important dates with smart reminders',
    category: 'Social',
    difficulty: 'Easy',
    impact: 'Low',
    icon: '🎂',
  },
  {
    id: 'social-7',
    name: 'Shared Goal Dashboard',
    description: 'Collaborate on goals with accountability buddies',
    category: 'Social',
    difficulty: 'Hard',
    impact: 'High',
    icon: '📊',
  },
  {
    id: 'social-8',
    name: 'Connection Intensity Tracker',
    description: 'Visualize the strength of your relationships over time',
    category: 'Social',
    difficulty: 'Medium',
    impact: 'Medium',
    icon: '💫',
  },

  // Gaming Category
  {
    id: 'gaming-1',
    name: 'Achievement System',
    description: 'Earn badges and achievements for health milestones',
    category: 'Gaming',
    difficulty: 'Medium',
    impact: 'Medium',
    icon: '🏅',
  },
  {
    id: 'gaming-2',
    name: 'Daily Quests',
    description: 'Gamified daily tasks with reward systems',
    category: 'Gaming',
    difficulty: 'Medium',
    impact: 'High',
    icon: '⚔️',
  },
  {
    id: 'gaming-3',
    name: 'XP Leveling System',
    description: 'Earn experience points for completing health tasks',
    category: 'Gaming',
    difficulty: 'Medium',
    impact: 'High',
    icon: '📈',
  },
  {
    id: 'gaming-4',
    name: 'Pet Tamagotchi Buddy',
    description: 'Virtual pet that grows with your wellness goals',
    category: 'Gaming',
    difficulty: 'Hard',
    impact: 'Medium',
    icon: '🐾',
  },
  {
    id: 'gaming-5',
    name: 'Leaderboard Competition',
    description: 'Friendly competition with community members',
    category: 'Gaming',
    difficulty: 'Hard',
    impact: 'Medium',
    icon: '🎮',
  },
  {
    id: 'gaming-6',
    name: 'Seasonal Battle Pass',
    description: 'Evolving challenges with seasonal rewards',
    category: 'Gaming',
    difficulty: 'Hard',
    impact: 'High',
    icon: '🎪',
  },
  {
    id: 'gaming-7',
    name: 'Boss Fight Challenges',
    description: 'Epic challenges for major wellness milestones',
    category: 'Gaming',
    difficulty: 'Hard',
    impact: 'Medium',
    icon: '👹',
  },
  {
    id: 'gaming-8',
    name: 'Skill Tree Progression',
    description: 'RPG-style skill tree for wellness capabilities',
    category: 'Gaming',
    difficulty: 'Hard',
    impact: 'Medium',
    icon: '🌳',
  },

  // AI Category
  {
    id: 'ai-1',
    name: 'Mood Prediction Engine',
    description: 'AI predicts mood swings based on patterns and triggers',
    category: 'AI',
    difficulty: 'Hard',
    impact: 'High',
    icon: '🔮',
  },
  {
    id: 'ai-2',
    name: 'Pattern Insight Generator',
    description: 'Discover hidden patterns in your health data',
    category: 'AI',
    difficulty: 'Hard',
    impact: 'High',
    icon: '🔍',
  },
  {
    id: 'ai-3',
    name: 'Personalized Recommendations',
    description: 'AI-powered wellness suggestions tailored to you',
    category: 'AI',
    difficulty: 'Hard',
    impact: 'High',
    icon: '💡',
  },
  {
    id: 'ai-4',
    name: 'Voice Journal Transcriber',
    description: 'Convert voice recordings to journaling entries',
    category: 'AI',
    difficulty: 'Hard',
    impact: 'Medium',
    icon: '🎙️',
  },
  {
    id: 'ai-5',
    name: 'Emotion Detection from Photos',
    description: 'AI analyzes your photos to detect emotional states',
    category: 'AI',
    difficulty: 'Hard',
    impact: 'Low',
    icon: '📸',
  },
  {
    id: 'ai-6',
    name: 'Smart Intervention Suggester',
    description: 'Real-time coping strategy suggestions based on context',
    category: 'AI',
    difficulty: 'Hard',
    impact: 'High',
    icon: '🛟',
  },
];

const CATEGORIES: Array<Feature['category']> = [
  'Wellness',
  'Creative',
  'Productivity',
  'Social',
  'Gaming',
  'AI',
];

const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'Easy':
      return 'var(--kol-success, #10b981)';
    case 'Medium':
      return 'var(--kol-warning, #f59e0b)';
    case 'Hard':
      return 'var(--kol-danger, #ef4444)';
    default:
      return 'var(--kol-accent, #d946ef)';
  }
};

const getImpactColor = (impact: string): string => {
  switch (impact) {
    case 'Low':
      return '#a0aec0';
    case 'Medium':
      return '#60a5fa';
    case 'High':
      return '#f472b6';
    default:
      return 'var(--kol-accent, #d946ef)';
  }
};

const FeatureEvolver: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Feature['category'] | 'All'>('All');
  const [queuedFeatures, setQueuedFeatures] = useState<QueuedFeature[]>([]);
  const [evolutionLog, setEvolutionLog] = useState<EvolutionLogEntry[]>([]);
  const [currentlyDisplayed, setCurrentlyDisplayed] = useState<Feature | null>(
    FEATURE_DATABASE[Math.floor(Math.random() * FEATURE_DATABASE.length)]
  );
  const [showSparkle, setShowSparkle] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const filteredFeatures = useMemo(() => {
    if (selectedCategory === 'All') {
      return FEATURE_DATABASE;
    }
    return FEATURE_DATABASE.filter((f) => f.category === selectedCategory);
  }, [selectedCategory]);

  const generateNewFeature = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * filteredFeatures.length);
    const newFeature = filteredFeatures[randomIndex];
    setCurrentlyDisplayed(newFeature);

    // Trigger sparkle animation
    setShowSparkle(true);
    setTimeout(() => setShowSparkle(false), 600);

    // Add to evolution log
    setEvolutionLog((prev) => [
      {
        id: `${newFeature.id}-${Date.now()}`,
        feature: newFeature,
        timestamp: Date.now(),
      },
      ...prev.slice(0, 9), // Keep last 10 entries
    ]);
  }, [filteredFeatures]);

  const addToQueue = useCallback(() => {
    if (!currentlyDisplayed) return;

    const existingIndex = queuedFeatures.findIndex((f) => f.id === currentlyDisplayed.id);
    if (existingIndex > -1) {
      // Remove if already queued
      setQueuedFeatures((prev) => prev.filter((_, i) => i !== existingIndex));
    } else {
      // Add to queue
      setQueuedFeatures((prev) => [
        ...prev,
        {
          ...currentlyDisplayed,
          queuedAt: Date.now(),
        },
      ]);
    }
  }, [currentlyDisplayed, queuedFeatures]);

  const removeFromQueue = useCallback((featureId: string) => {
    setQueuedFeatures((prev) => prev.filter((f) => f.id !== featureId));
  }, []);

  const isInQueue = currentlyDisplayed ? queuedFeatures.some((f) => f.id === currentlyDisplayed.id) : false;

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        background: 'linear-gradient(135deg, #1a0b2e 0%, #16213e 50%, #0f3460 100%)',
        color: 'var(--kol-text, #ffffff)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Main Content */}
      <div
        style={{
          flex: sidebarOpen ? '1 1 calc(100% - 400px)' : '1 1 100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'flex 0.3s ease',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px',
            borderBottom: '2px solid rgba(217, 70, 239, 0.3)',
            background: 'rgba(0, 0, 0, 0.2)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <div>
              <h1
                style={{
                  margin: '0 0 8px 0',
                  fontSize: '32px',
                  fontWeight: '900',
                  background: 'linear-gradient(135deg, #d946ef 0%, #ec4899 50%, #06b6d4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                ✨ Feature Evolver
              </h1>
              <p
                style={{
                  margin: 0,
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.6)',
                }}
              >
                Discover and queue next-generation wellness features
              </p>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                padding: '10px 16px',
                background: 'rgba(217, 70, 239, 0.2)',
                border: '1px solid var(--kol-accent, #d946ef)',
                color: 'var(--kol-accent, #d946ef)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(217, 70, 239, 0.4)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(217, 70, 239, 0.2)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {sidebarOpen ? '⊟ Close' : '⊞ Open'} Queue
            </button>
          </div>

          {/* Category Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '8px',
            }}
          >
            <button
              onClick={() => setSelectedCategory('All')}
              style={{
                padding: '8px 16px',
                background:
                  selectedCategory === 'All'
                    ? 'linear-gradient(135deg, #d946ef 0%, #ec4899 100%)'
                    : 'rgba(217, 70, 239, 0.15)',
                border: selectedCategory === 'All' ? '1px solid #d946ef' : '1px solid rgba(217, 70, 239, 0.3)',
                color: 'white',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (selectedCategory !== 'All') {
                  e.currentTarget.style.background = 'rgba(217, 70, 239, 0.25)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== 'All') {
                  e.currentTarget.style.background = 'rgba(217, 70, 239, 0.15)';
                }
              }}
            >
              All Features
            </button>
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: '8px 16px',
                  background:
                    selectedCategory === category
                      ? 'linear-gradient(135deg, #d946ef 0%, #ec4899 100%)'
                      : 'rgba(217, 70, 239, 0.15)',
                  border:
                    selectedCategory === category ? '1px solid #d946ef' : '1px solid rgba(217, 70, 239, 0.3)',
                  color: 'white',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== category) {
                    e.currentTarget.style.background = 'rgba(217, 70, 239, 0.25)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== category) {
                    e.currentTarget.style.background = 'rgba(217, 70, 239, 0.15)';
                  }
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 24px',
            overflow: 'auto',
          }}
        >
          {currentlyDisplayed ? (
            <>
              {/* Feature Card */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '500px',
                  marginBottom: '30px',
                }}
              >
                {/* Sparkle Effect */}
                {showSparkle && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '16px',
                      background: 'radial-gradient(circle, rgba(217, 70, 239, 0.4) 0%, transparent 70%)',
                      animation: 'pulse-sparkle 0.6s ease-out',
                      pointerEvents: 'none',
                      zIndex: 10,
                    } as any}
                  />
                )}

                <div
                  style={{
                    background: 'linear-gradient(135deg, rgba(217, 70, 239, 0.15) 0%, rgba(236, 72, 153, 0.1) 100%)',
                    border: '2px solid rgba(217, 70, 239, 0.4)',
                    borderRadius: '16px',
                    padding: '32px 24px',
                    boxShadow:
                      '0 8px 32px rgba(217, 70, 239, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      fontSize: '64px',
                      marginBottom: '16px',
                      textAlign: 'center',
                      animation: showSparkle ? 'bounce-icon 0.6s ease-out' : 'none',
                    } as any}
                  >
                    {currentlyDisplayed.icon}
                  </div>

                  {/* Feature Name */}
                  <h2
                    style={{
                      margin: '0 0 12px 0',
                      fontSize: '24px',
                      fontWeight: '700',
                      color: 'white',
                      textAlign: 'center',
                    }}
                  >
                    {currentlyDisplayed.name}
                  </h2>

                  {/* Description */}
                  <p
                    style={{
                      margin: '0 0 24px 0',
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      textAlign: 'center',
                      lineHeight: '1.6',
                    }}
                  >
                    {currentlyDisplayed.description}
                  </p>

                  {/* Category & Stats */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '12px',
                      marginBottom: '24px',
                    }}
                  >
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '12px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          marginBottom: '4px',
                        }}
                      >
                        Category
                      </div>
                      <div
                        style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        {currentlyDisplayed.category}
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '12px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          marginBottom: '4px',
                        }}
                      >
                        Difficulty
                      </div>
                      <div
                        style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          color: getDifficultyColor(currentlyDisplayed.difficulty),
                        }}
                      >
                        {currentlyDisplayed.difficulty}
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '12px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          marginBottom: '4px',
                        }}
                      >
                        Impact
                      </div>
                      <div
                        style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          color: getImpactColor(currentlyDisplayed.impact),
                        }}
                      >
                        {currentlyDisplayed.impact}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px',
                    }}
                  >
                    <button
                      onClick={generateNewFeature}
                      style={{
                        padding: '12px 20px',
                        background: 'rgba(217, 70, 239, 0.2)',
                        border: '1px solid rgba(217, 70, 239, 0.5)',
                        color: 'white',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(217, 70, 239, 0.35)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(217, 70, 239, 0.2)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      🎲 Generate New
                    </button>

                    <button
                      onClick={addToQueue}
                      style={{
                        padding: '12px 20px',
                        background: isInQueue
                          ? 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)'
                          : 'linear-gradient(135deg, #d946ef 0%, #ec4899 100%)',
                        border: 'none',
                        color: 'white',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'all 0.2s ease',
                        boxShadow: isInQueue
                          ? '0 4px 12px rgba(16, 185, 129, 0.3)'
                          : '0 4px 12px rgba(217, 70, 239, 0.3)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = isInQueue
                          ? '0 8px 16px rgba(16, 185, 129, 0.4)'
                          : '0 8px 16px rgba(217, 70, 239, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = isInQueue
                          ? '0 4px 12px rgba(16, 185, 129, 0.3)'
                          : '0 4px 12px rgba(217, 70, 239, 0.3)';
                      }}
                    >
                      {isInQueue ? '✓ Queued' : '+ Add to Queue'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Evolution Log */}
              {evolutionLog.length > 0 && (
                <div
                  style={{
                    width: '100%',
                    maxWidth: '500px',
                    marginTop: '20px',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'rgba(255, 255, 255, 0.7)',
                      margin: '0 0 12px 0',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    📜 Evolution Log
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      maxHeight: '200px',
                      overflowY: 'auto',
                    }}
                  >
                    {evolutionLog.map((entry) => (
                      <div
                        key={entry.id}
                        style={{
                          padding: '10px 12px',
                          background: 'rgba(217, 70, 239, 0.1)',
                          border: '1px solid rgba(217, 70, 239, 0.2)',
                          borderRadius: '6px',
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        {entry.feature.icon} {entry.feature.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.6)' }}>No features available</p>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar: Feature Queue */}
      {sidebarOpen && (
        <div
          style={{
            width: '400px',
            background: 'linear-gradient(135deg, rgba(26, 11, 46, 0.95) 0%, rgba(22, 33, 62, 0.95) 100%)',
            borderLeft: '2px solid rgba(217, 70, 239, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Queue Header */}
          <div
            style={{
              padding: '24px',
              borderBottom: '1px solid rgba(217, 70, 239, 0.2)',
            }}
          >
            <h2
              style={{
                margin: '0 0 8px 0',
                fontSize: '20px',
                fontWeight: '700',
                color: 'white',
              }}
            >
              📋 Feature Queue
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.6)',
              }}
            >
              {queuedFeatures.length} features selected
            </p>
          </div>

          {/* Queue Items */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {queuedFeatures.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: 'rgba(255, 255, 255, 0.4)',
                  fontSize: '14px',
                  textAlign: 'center',
                  padding: '24px',
                }}
              >
                Queue features by clicking "Add to Queue"
              </div>
            ) : (
              queuedFeatures.map((feature) => (
                <div
                  key={feature.id}
                  style={{
                    padding: '12px',
                    background: 'rgba(217, 70, 239, 0.12)',
                    border: '1px solid rgba(217, 70, 239, 0.3)',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(217, 70, 239, 0.2)';
                    e.currentTarget.style.borderColor = 'rgba(217, 70, 239, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(217, 70, 239, 0.12)';
                    e.currentTarget.style.borderColor = 'rgba(217, 70, 239, 0.3)';
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: 'white',
                        marginBottom: '4px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {feature.icon} {feature.name}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'rgba(255, 255, 255, 0.5)',
                      }}
                    >
                      {feature.category} • {feature.difficulty}
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromQueue(feature.id)}
                    style={{
                      padding: '6px 10px',
                      background: 'rgba(239, 68, 68, 0.2)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#ef4444',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600',
                      transition: 'all 0.2s ease',
                      marginLeft: '8px',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Queue Footer */}
          {queuedFeatures.length > 0 && (
            <div
              style={{
                padding: '16px',
                borderTop: '1px solid rgba(217, 70, 239, 0.2)',
                background: 'rgba(0, 0, 0, 0.1)',
              }}
            >
              <button
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #d946ef 0%, #ec4899 100%)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(217, 70, 239, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(217, 70, 239, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(217, 70, 239, 0.3)';
                }}
              >
                ✓ Commit Queue ({queuedFeatures.length})
              </button>
            </div>
          )}
        </div>
      )}

      {/* Keyframe Animations */}
      <style>{`
        @keyframes pulse-sparkle {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(1.4);
          }
        }

        @keyframes bounce-icon {
          0% {
            transform: scale(1) rotateZ(0deg);
          }
          50% {
            transform: scale(1.1) rotateZ(-5deg);
          }
          100% {
            transform: scale(1) rotateZ(0deg);
          }
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(217, 70, 239, 0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(217, 70, 239, 0.4);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(217, 70, 239, 0.6);
        }
      `}</style>
    </div>
  );
};

export default FeatureEvolver;
