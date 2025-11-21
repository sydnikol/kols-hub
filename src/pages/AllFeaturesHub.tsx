import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart, MessageSquare, Users, Eye, Moon, Sparkles, Home, Utensils, PawPrint,
  TrendingUp, Zap, Brain, Calendar, Activity, Search, ChevronDown, ChevronRight
} from 'lucide-react';

interface Feature {
  id: string;
  title: string;
  path: string;
  version: 'MVP' | 'V1' | 'V2' | 'V3' | 'V4';
  category: string;
}

const AllFeaturesHub: React.FC = () => {
  const [selectedVersion, setSelectedVersion] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['health']));

  // Comprehensive feature list across all versions
  const allFeatures: Feature[] = [
    // MVP Features
    { id: 'hydration', title: 'Hydration Dial', path: '/health/hydration', version: 'MVP', category: 'Health & Wellness' },
    { id: 'sodium', title: 'Sodium Intake Tracker', path: '/health/sodium', version: 'MVP', category: 'Health & Wellness' },
    { id: 'body-weather', title: 'Body Weather Dial', path: '/health/body-weather', version: 'MVP', category: 'Health & Wellness' },
    { id: 'pain-map', title: 'Pain Map', path: '/health/pain-map', version: 'MVP', category: 'Health & Wellness' },
    { id: 'crisis-calm', title: 'Crisis Calm Mode', path: '/crisis/calm-mode', version: 'MVP', category: 'Emergency & Crisis' },

    // V1 Health Logs (10)
    { id: 'trends', title: 'Trends & Correlations Chart', path: '/health/trends', version: 'V1', category: 'Health Logs' },
    { id: 'er-visits', title: 'Hospital & ER Visits Log', path: '/health/er-visits', version: 'V1', category: 'Health Logs' },
    { id: 'med-effects', title: 'Medication Effect Journal', path: '/health/med-effects', version: 'V1', category: 'Health Logs' },
    { id: 'appt-notes', title: 'Appointment Notes Binder', path: '/health/appointment-notes', version: 'V1', category: 'Health Logs' },
    { id: 'triggers', title: 'Trigger Library', path: '/health/triggers', version: 'V1', category: 'Health Logs' },
    { id: 'good-days', title: 'Good Days Gallery', path: '/health/good-days', version: 'V1', category: 'Health Logs' },
    { id: 'vital-alerts', title: 'Vitals Threshold Alerts', path: '/health/vital-alerts', version: 'V1', category: 'Health Logs' },
    { id: 'doctor-protocols', title: 'Doctor Protocol Cards', path: '/health/doctor-protocols', version: 'V1', category: 'Health Logs' },
    { id: 'allergies', title: 'Medication Allergies & Sensitivities', path: '/health/allergies', version: 'V1', category: 'Health Logs' },
    { id: 'vitals-snapshot', title: 'Vitals Snapshot', path: '/health/vitals-snapshot', version: 'V1', category: 'Health Logs' },

    // V1 Self-Advocacy (10)
    { id: 'scripts', title: 'Script Picker (Tone-Based)', path: '/advocacy/scripts', version: 'V1', category: 'Self-Advocacy' },
    { id: 'hearing-prep', title: 'Hearing Prep Wizard', path: '/advocacy/hearing-prep', version: 'V1', category: 'Self-Advocacy' },
    { id: 'insurance-helper', title: 'Insurance Call Helper', path: '/advocacy/insurance-helper', version: 'V1', category: 'Self-Advocacy' },
    { id: 'role-play', title: 'Doctor Visit Role-Play', path: '/advocacy/role-play', version: 'V1', category: 'Self-Advocacy' },
    { id: 'access-cards', title: 'Access Needs Card Generator', path: '/advocacy/access-cards', version: 'V1', category: 'Self-Advocacy' },
    { id: 'records-binder', title: 'Records Binder Index', path: '/advocacy/records-binder', version: 'V1', category: 'Self-Advocacy' },
    { id: 'appeal-letters', title: 'Appeal Letter Builder', path: '/advocacy/appeal-letters', version: 'V1', category: 'Self-Advocacy' },
    { id: 'accommodations', title: 'Accommodations Request Wizard', path: '/advocacy/accommodations', version: 'V1', category: 'Self-Advocacy' },
    { id: 'meeting-receipts', title: 'Meeting Receipt Logger', path: '/advocacy/meeting-receipts', version: 'V1', category: 'Self-Advocacy' },
    { id: 'boundaries', title: 'Care Boundary Library', path: '/advocacy/boundaries', version: 'V1', category: 'Self-Advocacy' },

    // V1 Care Team (10)
    { id: 'care-roles', title: 'Care Roles Matrix', path: '/care-team/roles-matrix', version: 'V1', category: 'Care Team' },
    { id: 'contact-rolodex', title: 'Contact Rolodex', path: '/care-team/contacts', version: 'V1', category: 'Care Team' },
    { id: 'consent', title: 'Consent & Info Sharing', path: '/care-team/consent', version: 'V1', category: 'Care Team' },
    { id: 'care-tasks', title: 'Care Tasks Queue', path: '/care-team/tasks', version: 'V1', category: 'Care Team' },
    { id: 'shift-notes', title: 'Shift Notes (HHA)', path: '/care-team/shift-notes', version: 'V1', category: 'Care Team' },
    { id: 'carpool', title: 'Appointment Carpool Planner', path: '/care-team/carpool', version: 'V1', category: 'Care Team' },
    { id: 'care-boundaries', title: 'Care Boundaries Poster', path: '/care-team/boundaries-poster', version: 'V1', category: 'Care Team' },
    { id: 'emergency-roles', title: 'Emergency Roles', path: '/care-team/emergency-roles', version: 'V1', category: 'Care Team' },
    { id: 'avs-parser', title: 'After-Visit Summary Parser', path: '/care-team/avs-parser', version: 'V1', category: 'Care Team' },
    { id: 'care-retro', title: 'Care Retrospective', path: '/care-team/retrospective', version: 'V1', category: 'Care Team' },

    // V1 Accessibility (9)
    { id: 'motion-toggle', title: 'Motion Sensitivity Toggle', path: '/accessibility/motion', version: 'V1', category: 'Accessibility' },
    { id: 'one-hand', title: 'One-Hand Mode', path: '/accessibility/one-hand', version: 'V1', category: 'Accessibility' },
    { id: 'large-targets', title: 'Large Tap Targets', path: '/accessibility/large-targets', version: 'V1', category: 'Accessibility' },
    { id: 'voice-commands', title: 'Voice-First Commands', path: '/accessibility/voice', version: 'V1', category: 'Accessibility' },
    { id: 'reading-mode', title: 'Reading Mode (Slow)', path: '/accessibility/reading-mode', version: 'V1', category: 'Accessibility' },
    { id: 'subtitles', title: 'Subtitles Everywhere', path: '/accessibility/subtitles', version: 'V1', category: 'Accessibility' },
    { id: 'color-profiles', title: 'Color Sensitivity Profiles', path: '/accessibility/color-profiles', version: 'V1', category: 'Accessibility' },
    { id: 'offline-cache', title: 'Offline First Cache', path: '/accessibility/offline', version: 'V1', category: 'Accessibility' },
    { id: 'keyboard-only', title: 'Keyboard-Only Flow', path: '/accessibility/keyboard', version: 'V1', category: 'Accessibility' },

    // V2 Relationships & Partners (10)
    { id: 'partner-checkins', title: 'Partner Check-In Slots', path: '/relationships/partner-checkins', version: 'V2', category: 'Relationships' },
    { id: 'affection-scripts', title: 'Affection Scripts', path: '/relationships/affection-scripts', version: 'V2', category: 'Relationships' },
    { id: 'travel-rituals', title: 'Travel Ritual Planner', path: '/relationships/travel-rituals', version: 'V2', category: 'Relationships' },
    { id: 'body-double', title: 'Appointment Body Double', path: '/relationships/body-double', version: 'V2', category: 'Relationships' },
    { id: 'joy-rituals', title: 'Joy Rituals', path: '/relationships/joy-rituals', version: 'V2', category: 'Relationships' },
    { id: 'boundary-repair', title: 'Boundary Repair Scripts', path: '/relationships/boundary-repair', version: 'V2', category: 'Relationships' },
    { id: 'calendar-peek', title: 'Shared Calendar Peek', path: '/relationships/calendar-peek', version: 'V2', category: 'Relationships' },
    { id: 'love-languages', title: 'Love Languages Mixer', path: '/relationships/love-languages', version: 'V2', category: 'Relationships' },
    { id: 'parallel-play', title: 'Parallel Play Timer', path: '/relationships/parallel-play', version: 'V2', category: 'Relationships' },
    { id: 'no-pressure-invites', title: 'No-Pressure Invite Sender', path: '/relationships/invites', version: 'V2', category: 'Relationships' },

    // V2 Social & Community (10)
    { id: 'community-wave', title: 'Community Check-In Wave', path: '/social/community-wave', version: 'V2', category: 'Social' },
    { id: 'event-a11y', title: 'Event Accessibility Checklist', path: '/social/event-accessibility', version: 'V2', category: 'Social' },
    { id: 'mutual-aid', title: 'Mutual Aid Binder', path: '/social/mutual-aid', version: 'V2', category: 'Social' },
    { id: 'tokenization-guard', title: 'Tokenization Guard Scripts', path: '/social/tokenization-guard', version: 'V2', category: 'Social' },
    { id: 'low-spoon-outings', title: 'Low-Spoon Outing Planner', path: '/social/low-spoon-outings', version: 'V2', category: 'Social' },
    { id: 'virtual-hang', title: 'Virtual Hang Hub', path: '/social/virtual-hang', version: 'V2', category: 'Social' },
    { id: 'win-jar', title: 'Win Jar', path: '/social/win-jar', version: 'V2', category: 'Social' },
    { id: 'memes-comfort', title: 'Memes & Comfort Feed', path: '/social/memes-comfort', version: 'V2', category: 'Social' },
    { id: 'exit-strategies', title: 'Exit Strategy Cards', path: '/social/exit-strategies', version: 'V2', category: 'Social' },
    { id: 'celebrations', title: 'Celebrations Board', path: '/social/celebrations', version: 'V2', category: 'Social' },

    // V2 Wardrobe & Outfits (10)
    { id: 'wardrobe-catalog', title: 'Wardrobe Catalog', path: '/wardrobe/catalog', version: 'V2', category: 'Wardrobe' },
    { id: 'outfit-builder', title: 'Outfit Builder', path: '/wardrobe/outfit-builder', version: 'V2', category: 'Wardrobe' },
    { id: 'sensory-safe', title: 'Sensory Safe Now', path: '/wardrobe/sensory-safe', version: 'V2', category: 'Wardrobe' },
    { id: 'weather-outfits', title: 'Weather Outfit Suggestions', path: '/wardrobe/weather-outfits', version: 'V2', category: 'Wardrobe' },
    { id: 'laundry-aware', title: 'Laundry-Aware Picks', path: '/wardrobe/laundry-aware', version: 'V2', category: 'Wardrobe' },
    { id: 'gothic-looks', title: 'Gothic Theme Looks', path: '/wardrobe/gothic-looks', version: 'V2', category: 'Wardrobe' },
    { id: 'accessories', title: 'Accessories Tracker', path: '/wardrobe/accessories', version: 'V2', category: 'Wardrobe' },
    { id: 'pack-trip', title: 'Pack for Trip', path: '/wardrobe/pack-trip', version: 'V2', category: 'Wardrobe' },
    { id: 'outfit-moodboard', title: 'Outfit Mood Board', path: '/wardrobe/moodboard', version: 'V2', category: 'Wardrobe' },
    { id: 'closet-stats', title: 'Closet Stats', path: '/wardrobe/stats', version: 'V2', category: 'Wardrobe' },

    // V2 Learning & Spiritual (10)
    { id: 'study-streaks', title: 'Study Streaks', path: '/learning/study-streaks', version: 'V2', category: 'Learning' },
    { id: 'rituals-planner', title: 'Rituals Planner', path: '/spiritual/rituals-planner', version: 'V2', category: 'Learning' },
    { id: 'grimoire', title: 'Grimoire Mode', path: '/spiritual/grimoire', version: 'V2', category: 'Learning' },
    { id: 'kanji-cards', title: 'Kanji & Kana Cards', path: '/learning/kanji-cards', version: 'V2', category: 'Learning' },
    { id: 'anime-phrasebook', title: 'Anime Phrasebook', path: '/learning/anime-phrasebook', version: 'V2', category: 'Learning' },
    { id: 'breath-code', title: 'Breath & Code Dojo', path: '/learning/breath-code', version: 'V2', category: 'Learning' },
    { id: 'study-body-double', title: 'Study Body Double', path: '/learning/study-body-double', version: 'V2', category: 'Learning' },
    { id: 'spell-supplies', title: 'Spell Supplies Inventory', path: '/spiritual/spell-supplies', version: 'V2', category: 'Learning' },
    { id: 'seasonal-cues', title: 'Seasonal Cues Automations', path: '/spiritual/seasonal-cues', version: 'V2', category: 'Learning' },
    { id: 'reflection-journal', title: 'Reflection Journal', path: '/spiritual/reflection-journal', version: 'V2', category: 'Learning' },

    // V2 Joy & Entertainment (10)
    { id: 'comedy-picker', title: 'Comedy Night Picker', path: '/entertainment/comedy-picker', version: 'V2', category: 'Entertainment' },
    { id: 'anime-watchlist', title: 'Anime Watchlist', path: '/entertainment/anime-watchlist', version: 'V2', category: 'Entertainment' },
    { id: 'game-spectator', title: 'Game Spectator Mode', path: '/entertainment/game-spectator', version: 'V2', category: 'Entertainment' },
    { id: 'cozy-night', title: 'Cozy Night Generator', path: '/entertainment/cozy-night', version: 'V2', category: 'Entertainment' },
    { id: 'memories-wall', title: 'Memories Wall', path: '/entertainment/memories-wall', version: 'V2', category: 'Entertainment' },
    { id: 'stickerboard', title: 'Stickerboard', path: '/entertainment/stickerboard', version: 'V2', category: 'Entertainment' },
    { id: 'silly-mode', title: 'Silly Mode (Max Chaos)', path: '/entertainment/silly-mode', version: 'V2', category: 'Entertainment' },
    { id: 'soundboard', title: 'Soundboard of Joy', path: '/entertainment/soundboard', version: 'V2', category: 'Entertainment' },
    { id: 'partner-surprises', title: 'Partner Surprise Ideas', path: '/entertainment/partner-surprises', version: 'V2', category: 'Entertainment' },
    { id: 'gratitude-sparkles', title: 'Gratitude Sparkles', path: '/entertainment/gratitude-sparkles', version: 'V2', category: 'Entertainment' },

    // V3 Features (50 total - showing key ones)
    { id: 'electrolyte-picker', title: 'Electrolyte Pack Picker', path: '/health/electrolyte-picker', version: 'V3', category: 'Advanced Health' },
    { id: 'hydration-hr-chart', title: 'Hydration vs HR Chart', path: '/health/hydration-hr-chart', version: 'V3', category: 'Advanced Health' },
    { id: '10min-tidy', title: '10-Minute Tidy Timer', path: '/household/10min-tidy', version: 'V3', category: 'Household' },
    { id: 'rotating-chores', title: 'Rotating Chore Wheel', path: '/household/rotating-chores', version: 'V3', category: 'Household' },
    { id: 'pet-care-schedule', title: 'Pet Care Schedule', path: '/pets/care-schedule', version: 'V3', category: 'Pets' },
    { id: 'vet-notes', title: 'Vet Notes Binder', path: '/pets/vet-notes', version: 'V3', category: 'Pets' },
    { id: 'meal-suggest', title: 'Meal Suggest (No Cheese)', path: '/food/meal-suggest', version: 'V3', category: 'Food' },
    { id: 'pantry-snacks', title: 'Pantry Safe Snacks', path: '/food/pantry-snacks', version: 'V3', category: 'Food' },

    // V4 Features (40 total - showing key ones)
    { id: 'mood-pain-overlay', title: 'Mood & Pain Overlay', path: '/advanced/mood-pain', version: 'V4', category: 'Body Weather Advanced' },
    { id: 'energy-budget', title: 'Energy Budget Planner', path: '/advanced/energy-budget', version: 'V4', category: 'Energy & Pacing' },
    { id: 'spoon-ledger', title: 'Spoon Ledger', path: '/advanced/spoon-ledger', version: 'V4', category: 'Energy & Pacing' },
    { id: 'command-palette', title: 'Command Palette (⌘K)', path: '/advanced/command-palette', version: 'V4', category: 'Core App' },
    { id: 'gothic-home', title: 'Gothic Minimal Home', path: '/advanced/gothic-home', version: 'V4', category: 'Core App' },
    { id: 'the-library', title: 'The Library (ChronoMuse)', path: '/chronomuse/library', version: 'V4', category: 'ChronoMuse' },
    { id: 'the-studio', title: 'The Studio (ChronoMuse)', path: '/chronomuse/studio', version: 'V4', category: 'ChronoMuse' },
    { id: 'the-sanctuary', title: 'The Sanctuary (ChronoMuse)', path: '/chronomuse/sanctuary', version: 'V4', category: 'ChronoMuse' },
  ];

  const categories = Array.from(new Set(allFeatures.map(f => f.category))).sort();
  const versions = ['MVP', 'V1', 'V2', 'V3', 'V4'];

  const filteredFeatures = allFeatures.filter(feature => {
    const matchesVersion = selectedVersion === 'all' || feature.version === selectedVersion;
    const matchesCategory = selectedCategory === 'all' || feature.category === selectedCategory;
    const matchesSearch = feature.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesVersion && matchesCategory && matchesSearch;
  });

  const groupedFeatures = filteredFeatures.reduce((acc, feature) => {
    if (!acc[feature.category]) acc[feature.category] = [];
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, Feature[]>);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const getVersionColor = (version: string) => {
    const colors = {
      'MVP': 'bg-green-500/20 text-green-400 border-green-500/30',
      'V1': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'V2': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'V3': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      'V4': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    };
    return colors[version as keyof typeof colors] || colors.V1;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      'Health & Wellness': Heart,
      'Health Logs': TrendingUp,
      'Self-Advocacy': MessageSquare,
      'Care Team': Users,
      'Accessibility': Eye,
      'Relationships': Sparkles,
      'Social': Users,
      'Wardrobe': Home,
      'Learning': Brain,
      'Entertainment': Activity,
      'Advanced Health': Activity,
      'Household': Home,
      'Pets': PawPrint,
      'Food': Utensils,
    };
    return icons[category] || Activity;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-3">
            <Sparkles size={48} />
            All Features Hub
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Browse all 200+ features across MVP, V1, V2, V3, and V4
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {versions.map(version => {
            const count = allFeatures.filter(f => f.version === version).length;
            return (
              <div key={version} className="bg-black/40 backdrop-blur-lg rounded-xl p-4 border border-purple-500/20">
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {count}
                </div>
                <div className="text-sm text-gray-400 mt-1">{version} Features</div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search features..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
            />
          </div>

          <select
            value={selectedVersion}
            onChange={(e) => setSelectedVersion(e.target.value)}
            className="px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400"
          >
            <option value="all">All Versions</option>
            {versions.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 bg-purple-900/30 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Results */}
        <div className="text-sm text-gray-400 mb-4">
          Showing {filteredFeatures.length} of {allFeatures.length} features
        </div>

        {/* Features by Category */}
        <div className="space-y-4">
          {Object.entries(groupedFeatures).map(([category, features]) => {
            const Icon = getCategoryIcon(category);
            const isExpanded = expandedCategories.has(category);

            return (
              <div key={category} className="bg-black/40 backdrop-blur-lg rounded-xl border border-purple-500/20 overflow-hidden">
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-purple-900/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={24} className="text-purple-400" />
                    <h3 className="text-xl font-semibold text-white">{category}</h3>
                    <span className="text-sm text-gray-400">({features.length})</span>
                  </div>
                  {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </button>

                {isExpanded && (
                  <div className="px-6 pb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {features.map(feature => (
                      <Link
                        key={feature.id}
                        to={feature.path}
                        className="group p-4 bg-purple-900/10 hover:bg-purple-900/20 rounded-lg border border-purple-500/10 hover:border-purple-400/30 transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-white group-hover:text-purple-300 transition-colors flex-1">
                            {feature.title}
                          </h4>
                          <span className={`text-xs px-2 py-1 rounded-full border ${getVersionColor(feature.version)}`}>
                            {feature.version}
                          </span>
                        </div>
                        <span className="text-purple-400 text-sm group-hover:translate-x-1 transition-transform inline-block">
                          Open →
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AllFeaturesHub;
