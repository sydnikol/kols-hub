import React, { useState, useMemo } from 'react';
import {
  Palette, BookOpen, Music, Lightbulb, Activity, Trophy, Clock,
  TrendingUp, Filter, Star, Play, Pause, CheckCircle, Edit3,
  Image, Mic, PenTool, Heart, Award, Calendar, Search, Plus,
  GraduationCap
} from 'lucide-react';
import AITeacherPanel from '../components/AITeacherPanel';
import { TeachingDomain } from '../services/unified-ai-teacher';

type TabType = 'overview' | 'writing' | 'art' | 'music' | 'ideas';
type StatusType = 'in-progress' | 'completed' | 'planned';
type MediumType = 'digital' | 'traditional' | 'mixed' | 'poetry' | 'prose' | 'guitar' | 'piano' | 'vocals';

interface WritingEntry {
  id: number;
  title: string;
  type: 'poetry' | 'prose' | 'journal';
  wordCount: number;
  date: string;
  status: StatusType;
  content: string;
  mood: string;
}

interface ArtProject {
  id: number;
  title: string;
  medium: 'digital' | 'traditional' | 'mixed';
  status: StatusType;
  date: string;
  timeSpent: number;
  description: string;
  imageColor: string;
  tags: string[];
}

interface MusicSession {
  id: number;
  instrument: 'guitar' | 'piano' | 'vocals';
  song: string;
  duration: number;
  date: string;
  progress: number;
  notes: string;
}

interface CreativeIdea {
  id: number;
  title: string;
  category: string;
  description: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
  tags: string[];
}

const CreativeArtsDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterMedium, setFilterMedium] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [showAITeacher, setShowAITeacher] = useState<boolean>(false);
  const [aiTeacherDomain, setAITeacherDomain] = useState<TeachingDomain>('creative-writing');

  // Sample Data - Writing Entries
  const writingEntries: WritingEntry[] = [
    {
      id: 1,
      title: "Midnight Reflections",
      type: "poetry",
      wordCount: 342,
      date: "2025-11-20",
      status: "completed",
      content: "A poem about the quiet moments of introspection under starlit skies...",
      mood: "contemplative"
    },
    {
      id: 2,
      title: "The Forgotten Garden",
      type: "prose",
      wordCount: 1256,
      date: "2025-11-19",
      status: "in-progress",
      content: "A short story exploring themes of memory and loss through magical realism...",
      mood: "nostalgic"
    },
    {
      id: 3,
      title: "Morning Pages",
      type: "journal",
      wordCount: 487,
      date: "2025-11-21",
      status: "completed",
      content: "Stream of consciousness writing about creativity and daily inspiration...",
      mood: "hopeful"
    },
    {
      id: 4,
      title: "Ocean Whispers",
      type: "poetry",
      wordCount: 218,
      date: "2025-11-18",
      status: "completed",
      content: "Verses capturing the eternal dance between shore and sea...",
      mood: "peaceful"
    },
    {
      id: 5,
      title: "Character Sketches",
      type: "prose",
      wordCount: 892,
      date: "2025-11-17",
      status: "in-progress",
      content: "Developing backstories for a fantasy novel series...",
      mood: "excited"
    }
  ];

  // Sample Data - Art Projects
  const artProjects: ArtProject[] = [
    {
      id: 1,
      title: "Abstract Emotions Series",
      medium: "digital",
      status: "completed",
      date: "2025-11-15",
      timeSpent: 180,
      description: "Digital paintings exploring emotional landscapes through color and form",
      imageColor: "from-purple-500 to-pink-500",
      tags: ["abstract", "digital-art", "emotions"]
    },
    {
      id: 2,
      title: "Urban Sketches Collection",
      medium: "traditional",
      status: "in-progress",
      date: "2025-11-20",
      timeSpent: 120,
      description: "Pen and ink drawings of architectural details and street scenes",
      imageColor: "from-gray-600 to-gray-800",
      tags: ["sketching", "urban", "ink"]
    },
    {
      id: 3,
      title: "Nature Study - Botanical",
      medium: "mixed",
      status: "completed",
      date: "2025-11-12",
      timeSpent: 240,
      description: "Watercolor and pen botanical illustrations with scientific accuracy",
      imageColor: "from-green-400 to-emerald-600",
      tags: ["botanical", "watercolor", "nature"]
    },
    {
      id: 4,
      title: "Portrait Practice",
      medium: "digital",
      status: "in-progress",
      date: "2025-11-19",
      timeSpent: 150,
      description: "Digital portrait studies focusing on lighting and skin tones",
      imageColor: "from-orange-400 to-red-500",
      tags: ["portrait", "digital", "lighting"]
    },
    {
      id: 5,
      title: "Fantasy Landscapes",
      medium: "digital",
      status: "planned",
      date: "2025-11-21",
      timeSpent: 60,
      description: "Concept art for imaginary worlds and dreamscapes",
      imageColor: "from-blue-400 to-purple-600",
      tags: ["fantasy", "landscape", "concept-art"]
    },
    {
      id: 6,
      title: "Charcoal Studies",
      medium: "traditional",
      status: "completed",
      date: "2025-11-10",
      timeSpent: 90,
      description: "Light and shadow studies using charcoal on textured paper",
      imageColor: "from-gray-700 to-black",
      tags: ["charcoal", "study", "traditional"]
    }
  ];

  // Sample Data - Music Sessions
  const musicSessions: MusicSession[] = [
    {
      id: 1,
      instrument: "guitar",
      song: "Blackbird - The Beatles",
      duration: 45,
      date: "2025-11-21",
      progress: 75,
      notes: "Fingerpicking pattern becoming smoother. Need to work on transitions."
    },
    {
      id: 2,
      instrument: "piano",
      song: "Clair de Lune - Debussy",
      duration: 60,
      date: "2025-11-20",
      progress: 40,
      notes: "Working on the middle section. Dynamics need more attention."
    },
    {
      id: 3,
      instrument: "vocals",
      song: "Scales and Warmups",
      duration: 30,
      date: "2025-11-21",
      progress: 100,
      notes: "Daily vocal exercises. Range feeling better today."
    },
    {
      id: 4,
      instrument: "guitar",
      song: "Stairway to Heaven - Led Zeppelin",
      duration: 50,
      date: "2025-11-19",
      progress: 60,
      notes: "Solo section is challenging but making progress daily."
    },
    {
      id: 5,
      instrument: "piano",
      song: "River Flows in You - Yiruma",
      duration: 40,
      date: "2025-11-18",
      progress: 85,
      notes: "Almost performance ready. Memorization complete."
    },
    {
      id: 6,
      instrument: "vocals",
      song: "Hallelujah - Cohen",
      duration: 35,
      date: "2025-11-17",
      progress: 70,
      notes: "Working on emotional delivery and breath control."
    }
  ];

  // Sample Data - Creative Ideas
  const creativeIdeas: CreativeIdea[] = [
    {
      id: 1,
      title: "Interactive Digital Art Installation",
      category: "Art",
      description: "Create a motion-responsive digital art piece that changes based on viewer movement",
      date: "2025-11-20",
      priority: "high",
      tags: ["interactive", "digital", "installation"]
    },
    {
      id: 2,
      title: "Concept Album: Seasons of Change",
      category: "Music",
      description: "Four-song EP representing each season, mixing acoustic and electronic elements",
      date: "2025-11-19",
      priority: "high",
      tags: ["album", "concept", "production"]
    },
    {
      id: 3,
      title: "Short Story Collection: Urban Myths",
      category: "Writing",
      description: "Modern retellings of classic myths set in contemporary urban environments",
      date: "2025-11-18",
      priority: "medium",
      tags: ["fiction", "mythology", "short-stories"]
    },
    {
      id: 4,
      title: "Daily Creativity Challenge",
      category: "Multi-medium",
      description: "30-day challenge alternating between different creative mediums each day",
      date: "2025-11-21",
      priority: "high",
      tags: ["challenge", "practice", "growth"]
    },
    {
      id: 5,
      title: "Collaborative Art Project",
      category: "Art",
      description: "Community mural combining various artistic styles and techniques",
      date: "2025-11-16",
      priority: "medium",
      tags: ["collaborative", "community", "mural"]
    }
  ];

  // Calculate statistics
  const stats = useMemo(() => {
    const totalWritingWords = writingEntries.reduce((sum, entry) => sum + entry.wordCount, 0);
    const totalArtTime = artProjects.reduce((sum, project) => sum + project.timeSpent, 0);
    const totalMusicTime = musicSessions.reduce((sum, session) => sum + session.duration, 0);
    const completedProjects = [
      ...writingEntries.filter(e => e.status === 'completed'),
      ...artProjects.filter(p => p.status === 'completed'),
      ...musicSessions.filter(s => s.progress === 100)
    ].length;

    return {
      totalWritingWords,
      totalArtTime,
      totalMusicTime,
      completedProjects,
      totalProjects: writingEntries.length + artProjects.length + musicSessions.length,
      totalIdeas: creativeIdeas.length
    };
  }, []);

  // Timer functionality
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const tabs: Array<{ id: TabType; label: string; icon: any; color: string }> = [
    { id: 'overview', label: 'Overview', icon: Activity, color: 'purple' },
    { id: 'writing', label: 'Writing', icon: BookOpen, color: 'purple' },
    { id: 'art', label: 'Art', icon: Palette, color: 'violet' },
    { id: 'music', label: 'Music', icon: Music, color: 'indigo' },
    { id: 'ideas', label: 'Ideas', icon: Lightbulb, color: 'purple' },
  ];

  // Filter functions
  const filteredWriting = writingEntries.filter(entry => {
    if (filterStatus !== 'all' && entry.status !== filterStatus) return false;
    if (searchQuery && !entry.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const filteredArt = artProjects.filter(project => {
    if (filterStatus !== 'all' && project.status !== filterStatus) return false;
    if (filterMedium !== 'all' && project.medium !== filterMedium) return false;
    if (searchQuery && !project.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const filteredMusic = musicSessions.filter(session => {
    if (searchQuery && !session.song.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const filteredIdeas = creativeIdeas.filter(idea => {
    if (searchQuery && !idea.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-violet-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
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

            {/* AI Teacher Button */}
            <button
              onClick={() => setShowAITeacher(!showAITeacher)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                showAITeacher
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                  : 'bg-purple-900/30 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20'
              }`}
            >
              <GraduationCap className="w-5 h-5" />
              <span className="font-semibold">AI Teacher</span>
            </button>

            {/* Practice Timer */}
            <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-purple-400" />
                <div className="text-2xl font-mono font-bold text-purple-300">
                  {formatTime(timerSeconds)}
                </div>
                <button
                  onClick={() => setTimerActive(!timerActive)}
                  className={`p-2 rounded-lg transition-all ${
                    timerActive
                      ? 'bg-pink-500/30 text-pink-300 hover:bg-pink-500/40'
                      : 'bg-teal-500/30 text-teal-300 hover:bg-teal-500/40'
                  }`}
                >
                  {timerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                {timerSeconds > 0 && (
                  <button
                    onClick={() => { setTimerSeconds(0); setTimerActive(false); }}
                    className="text-purple-400 hover:text-purple-300 text-sm"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
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
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 p-6 rounded-xl border border-purple-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <Trophy className="w-8 h-8 text-yellow-400" />
                    <span className="text-2xl font-bold text-yellow-400">{stats.completedProjects}</span>
                  </div>
                  <h3 className="text-white font-semibold">Completed</h3>
                  <p className="text-purple-300 text-sm">Projects finished</p>
                </div>

                <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 p-6 rounded-xl border border-pink-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <Edit3 className="w-8 h-8 text-pink-400" />
                    <span className="text-2xl font-bold text-pink-400">{stats.totalWritingWords.toLocaleString()}</span>
                  </div>
                  <h3 className="text-white font-semibold">Words Written</h3>
                  <p className="text-pink-300 text-sm">Total word count</p>
                </div>

                <div className="bg-gradient-to-br from-teal-500/20 to-teal-600/20 p-6 rounded-xl border border-teal-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <Clock className="w-8 h-8 text-teal-400" />
                    <span className="text-2xl font-bold text-teal-400">{Math.round((stats.totalArtTime + stats.totalMusicTime) / 60)}h</span>
                  </div>
                  <h3 className="text-white font-semibold">Practice Time</h3>
                  <p className="text-teal-300 text-sm">Hours dedicated</p>
                </div>

                <div className="bg-gradient-to-br from-violet-500/20 to-violet-600/20 p-6 rounded-xl border border-violet-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <Lightbulb className="w-8 h-8 text-violet-400" />
                    <span className="text-2xl font-bold text-violet-400">{stats.totalIdeas}</span>
                  </div>
                  <h3 className="text-white font-semibold">Creative Ideas</h3>
                  <p className="text-violet-300 text-sm">Waiting to explore</p>
                </div>
              </div>

              {/* Achievement Badges */}
              <div className="bg-purple-900/20 p-6 rounded-xl border border-purple-500/30">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-6 h-6 text-purple-400" />
                  <h3 className="text-xl font-bold text-purple-300">Recent Achievements</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-4 rounded-lg border border-yellow-500/30">
                    <Star className="w-6 h-6 text-yellow-400 mb-2" />
                    <h4 className="text-white font-semibold">Wordsmith</h4>
                    <p className="text-yellow-300 text-sm">Wrote 1000+ words</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 rounded-lg border border-purple-500/30">
                    <Heart className="w-6 h-6 text-pink-400 mb-2" />
                    <h4 className="text-white font-semibold">Dedicated Artist</h4>
                    <p className="text-pink-300 text-sm">100+ hours practiced</p>
                  </div>
                  <div className="bg-gradient-to-r from-teal-500/20 to-cyan-500/20 p-4 rounded-lg border border-teal-500/30">
                    <TrendingUp className="w-6 h-6 text-teal-400 mb-2" />
                    <h4 className="text-white font-semibold">Consistent Creator</h4>
                    <p className="text-teal-300 text-sm">7 day streak</p>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {tabs.slice(1).map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className="bg-gradient-to-br from-purple-900/30 to-violet-900/30 p-6 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all text-left group"
                    >
                      <Icon className="w-8 h-8 text-purple-400 mb-3 group-hover:text-purple-300 transition-colors" />
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
            </div>
          )}

          {/* Writing Journal Tab */}
          {activeTab === 'writing' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/30">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                      <input
                        type="text"
                        placeholder="Search writings..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-purple-900/30 border border-purple-500/30 rounded-lg pl-10 pr-4 py-2 text-purple-200 placeholder-purple-400/50"
                      />
                    </div>
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-purple-900/30 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-200"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="planned">Planned</option>
                  </select>
                </div>
              </div>

              {/* Writing Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-pink-900/20 p-4 rounded-xl border border-pink-500/30">
                  <div className="flex items-center gap-3">
                    <Edit3 className="w-6 h-6 text-pink-400" />
                    <div>
                      <div className="text-2xl font-bold text-pink-300">{stats.totalWritingWords.toLocaleString()}</div>
                      <div className="text-pink-400 text-sm">Total Words</div>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/30">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-purple-400" />
                    <div>
                      <div className="text-2xl font-bold text-purple-300">{writingEntries.length}</div>
                      <div className="text-purple-400 text-sm">Total Entries</div>
                    </div>
                  </div>
                </div>
                <div className="bg-violet-900/20 p-4 rounded-xl border border-violet-500/30">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-violet-400" />
                    <div>
                      <div className="text-2xl font-bold text-violet-300">
                        {writingEntries.filter(e => e.status === 'completed').length}
                      </div>
                      <div className="text-violet-400 text-sm">Completed</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Writing Entries */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredWriting.map(entry => (
                  <div
                    key={entry.id}
                    className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1">{entry.title}</h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded">
                            {entry.type}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            entry.status === 'completed'
                              ? 'bg-teal-500/20 text-teal-300'
                              : entry.status === 'in-progress'
                              ? 'bg-yellow-500/20 text-yellow-300'
                              : 'bg-gray-500/20 text-gray-300'
                          }`}>
                            {entry.status}
                          </span>
                          <span className="text-xs text-purple-400">{entry.mood}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-pink-400">{entry.wordCount}</div>
                        <div className="text-xs text-purple-400">words</div>
                      </div>
                    </div>
                    <p className="text-purple-200 text-sm mb-3">{entry.content}</p>
                    <div className="flex items-center justify-between text-xs text-purple-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(entry.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Art Portfolio Tab */}
          {activeTab === 'art' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/30">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                      <input
                        type="text"
                        placeholder="Search art projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-purple-900/30 border border-purple-500/30 rounded-lg pl-10 pr-4 py-2 text-purple-200 placeholder-purple-400/50"
                      />
                    </div>
                  </div>
                  <select
                    value={filterMedium}
                    onChange={(e) => setFilterMedium(e.target.value)}
                    className="bg-purple-900/30 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-200"
                  >
                    <option value="all">All Mediums</option>
                    <option value="digital">Digital</option>
                    <option value="traditional">Traditional</option>
                    <option value="mixed">Mixed Media</option>
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-purple-900/30 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-200"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="planned">Planned</option>
                  </select>
                </div>
              </div>

              {/* Art Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArt.map(project => (
                  <div
                    key={project.id}
                    className="bg-purple-900/20 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all overflow-hidden group"
                  >
                    {/* Project Image Placeholder */}
                    <div className={`h-48 bg-gradient-to-br ${project.imageColor} flex items-center justify-center`}>
                      <Image className="w-16 h-16 text-white/50" />
                    </div>

                    {/* Project Details */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                      <p className="text-purple-200 text-sm mb-3">{project.description}</p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className={`px-2 py-1 rounded text-xs ${
                          project.status === 'completed'
                            ? 'bg-teal-500/20 text-teal-300'
                            : project.status === 'in-progress'
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : 'bg-gray-500/20 text-gray-300'
                        }`}>
                          {project.status}
                        </span>
                        <span className="text-purple-400 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {project.timeSpent}m
                        </span>
                      </div>

                      <div className="mt-3 pt-3 border-t border-purple-500/20">
                        <div className="flex items-center justify-between text-xs text-purple-400">
                          <span>{project.medium}</span>
                          <span>{new Date(project.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Music Practice Tab */}
          {activeTab === 'music' && (
            <div className="space-y-6">
              {/* Search */}
              <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/30">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                  <input
                    type="text"
                    placeholder="Search songs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-purple-900/30 border border-purple-500/30 rounded-lg pl-10 pr-4 py-2 text-purple-200 placeholder-purple-400/50"
                  />
                </div>
              </div>

              {/* Music Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-indigo-900/20 p-4 rounded-xl border border-indigo-500/30">
                  <div className="flex items-center gap-3">
                    <Music className="w-6 h-6 text-indigo-400" />
                    <div>
                      <div className="text-2xl font-bold text-indigo-300">{musicSessions.length}</div>
                      <div className="text-indigo-400 text-sm">Sessions</div>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/30">
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-purple-400" />
                    <div>
                      <div className="text-2xl font-bold text-purple-300">{Math.round(stats.totalMusicTime / 60)}h</div>
                      <div className="text-purple-400 text-sm">Practice Time</div>
                    </div>
                  </div>
                </div>
                <div className="bg-teal-900/20 p-4 rounded-xl border border-teal-500/30">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-teal-400" />
                    <div>
                      <div className="text-2xl font-bold text-teal-300">
                        {Math.round(musicSessions.reduce((sum, s) => sum + s.progress, 0) / musicSessions.length)}%
                      </div>
                      <div className="text-teal-400 text-sm">Avg Progress</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Music Sessions */}
              <div className="space-y-4">
                {filteredMusic.map(session => (
                  <div
                    key={session.id}
                    className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 p-6 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {session.instrument === 'guitar' && <Music className="w-6 h-6 text-purple-400" />}
                          {session.instrument === 'piano' && <PenTool className="w-6 h-6 text-indigo-400" />}
                          {session.instrument === 'vocals' && <Mic className="w-6 h-6 text-pink-400" />}
                          <h3 className="text-xl font-bold text-white">{session.song}</h3>
                        </div>
                        <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded capitalize">
                          {session.instrument}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-purple-300">{session.duration}m</div>
                        <div className="text-xs text-purple-400">duration</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-purple-300">Progress</span>
                        <span className="text-sm font-bold text-purple-300">{session.progress}%</span>
                      </div>
                      <div className="h-2 bg-purple-900/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                          style={{ width: `${session.progress}%` }}
                        />
                      </div>
                    </div>

                    <p className="text-purple-200 text-sm mb-2">{session.notes}</p>
                    <div className="flex items-center justify-between text-xs text-purple-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(session.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Creative Ideas Tab */}
          {activeTab === 'ideas' && (
            <div className="space-y-6">
              {/* Search */}
              <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/30">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                  <input
                    type="text"
                    placeholder="Search ideas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-purple-900/30 border border-purple-500/30 rounded-lg pl-10 pr-4 py-2 text-purple-200 placeholder-purple-400/50"
                  />
                </div>
              </div>

              {/* Ideas Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredIdeas.map(idea => (
                  <div
                    key={idea.id}
                    className={`p-6 rounded-xl border transition-all ${
                      idea.priority === 'high'
                        ? 'bg-gradient-to-br from-pink-900/30 to-purple-900/30 border-pink-500/30 hover:border-pink-400/50'
                        : idea.priority === 'medium'
                        ? 'bg-gradient-to-br from-purple-900/30 to-violet-900/30 border-purple-500/30 hover:border-purple-400/50'
                        : 'bg-gradient-to-br from-violet-900/30 to-indigo-900/30 border-violet-500/30 hover:border-violet-400/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <Lightbulb className={`w-6 h-6 ${
                        idea.priority === 'high' ? 'text-pink-400' :
                        idea.priority === 'medium' ? 'text-purple-400' : 'text-violet-400'
                      }`} />
                      <span className={`text-xs px-2 py-1 rounded ${
                        idea.priority === 'high'
                          ? 'bg-pink-500/20 text-pink-300'
                          : idea.priority === 'medium'
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'bg-violet-500/20 text-violet-300'
                      }`}>
                        {idea.priority} priority
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">{idea.title}</h3>
                    <span className="inline-block text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded mb-3">
                      {idea.category}
                    </span>

                    <p className="text-purple-200 text-sm mb-4">{idea.description}</p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {idea.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 bg-purple-500/10 text-purple-300 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-purple-400 pt-3 border-t border-purple-500/20">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(idea.date).toLocaleDateString()}
                      </span>
                      <button className="text-purple-300 hover:text-purple-200 transition-colors">
                        Start Project →
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Idea Button */}
              <button className="w-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-dashed border-purple-500/30 hover:border-purple-400/50 rounded-xl p-6 transition-all group">
                <Plus className="w-8 h-8 text-purple-400 group-hover:text-purple-300 mx-auto mb-2" />
                <span className="text-purple-300 font-semibold">Add New Creative Idea</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* AI Teacher Panel */}
      {showAITeacher && (
        <div className="fixed bottom-4 right-4 w-96 max-w-[calc(100vw-2rem)] z-50">
          <div className="mb-2 flex gap-2 justify-end">
            <button
              onClick={() => setAITeacherDomain('creative-writing')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                aiTeacherDomain === 'creative-writing'
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/50'
              }`}
            >
              Writing
            </button>
            <button
              onClick={() => setAITeacherDomain('poetry')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                aiTeacherDomain === 'poetry'
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/50'
              }`}
            >
              Poetry
            </button>
            <button
              onClick={() => setAITeacherDomain('visual-art')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                aiTeacherDomain === 'visual-art'
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/50'
              }`}
            >
              Art
            </button>
            <button
              onClick={() => setAITeacherDomain('music')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                aiTeacherDomain === 'music'
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/50'
              }`}
            >
              Music
            </button>
          </div>
          <AITeacherPanel
            domain={aiTeacherDomain}
            onClose={() => setShowAITeacher(false)}
          />
        </div>
      )}

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
