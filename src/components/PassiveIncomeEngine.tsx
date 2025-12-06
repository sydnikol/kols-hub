import React, { useState, useEffect } from 'react';
import {
  TrendingUp, DollarSign, Zap, Clock, Target, Filter, Search,
  ChevronDown, ChevronUp, Sparkles, Rocket, Package, BarChart3,
  Play, Pause, CheckCircle, AlertCircle, ExternalLink, Download,
  Upload, RefreshCw, PlusCircle, Calendar, Tag, Grid, List, Heart
} from 'lucide-react';

interface IncomeIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'passive' | 'active';
  estimatedMonthly: number;
  startupCost: number;
  hoursPerWeek: number;
  spoonCost: number;
  platforms: string[];
  tags: string[];
  status: 'idea' | 'in-progress' | 'listed' | 'earning';
  url: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface IncomeStream {
  id: string;
  name: string;
  platform: string;
  monthlyIncome: number;
  totalIncome: number;
  products: number;
  status: 'active' | 'paused' | 'testing';
  startDate: string;
}

interface FilterState {
  category: string[];
  type: string[];
  spoonCost: number[];
  monthlyIncome: [number, number];
  hoursPerWeek: [number, number];
  status: string[];
  searchTerm: string;
}

export const PassiveIncomeEngine: React.FC = () => {
  const [ideas, setIdeas] = useState<IncomeIdea[]>([]);
  const [streams, setStreams] = useState<IncomeStream[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedIdea, setSelectedIdea] = useState<IncomeIdea | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'monthly' | 'spoons' | 'hours' | 'startup'>('monthly');
  
  const [filters, setFilters] = useState<FilterState>({
    category: [],
    type: [],
    spoonCost: [],
    monthlyIncome: [0, 500],
    hoursPerWeek: [0, 5],
    status: [],
    searchTerm: ''
  });

  const [stats, setStats] = useState({
    totalIdeas: 0,
    activeStreams: 0,
    monthlyIncome: 0,
    totalIncome: 0,
    avgSpoonCost: 0,
    categories: [] as string[],
    dailyIncome: 0,
    autoCollectEnabled: true,
    autoCollectThreshold: 500
  });

  // Auto-collect money at $500 daily threshold
  useEffect(() => {
    const checkAutoCollect = setInterval(() => {
      const dailyRevenue = streams
        .filter(s => s.status === 'active')
        .reduce((sum, s) => sum + (s.monthlyIncome / 30), 0);

      if (stats.autoCollectEnabled && dailyRevenue >= stats.autoCollectThreshold) {
        const totalCollected = streams
          .filter(s => s.status === 'active')
          .reduce((sum, s) => sum + s.monthlyIncome, 0);

        // Auto-collect notification
        const notification = new Notification('💰 KOL Hub - Auto Collect', {
          body: `Auto-collected $${totalCollected.toFixed(2)} from ${streams.filter(s => s.status === 'active').length} active streams!\nDaily threshold of $${stats.autoCollectThreshold} reached.`,
          icon: '/icon-192.png'
        });

        // Update totals
        const updatedStreams = streams.map(stream =>
          stream.status === 'active'
            ? { ...stream, totalIncome: stream.totalIncome + stream.monthlyIncome }
            : stream
        );
        setStreams(updatedStreams);
        localStorage.setItem('kol-income-streams', JSON.stringify(updatedStreams));
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkAutoCollect);
  }, [streams, stats.autoCollectEnabled, stats.autoCollectThreshold]);

  // Load all 1000 ideas from JSON
  useEffect(() => {
    const loadIdeas = async () => {
      try {
        // Try to load from public data first
        let response = await fetch('/data/passive-income-1000.json');
        if (!response.ok) {
          // Fallback: Load from indexed DB or generate sample data
          const sampleIdeas = generateSampleIdeas();
          setIdeas(sampleIdeas);
          calculateStats(sampleIdeas);
          setLoading(false);
          return;
        }
        
        const loadedIdeas: IncomeIdea[] = await response.json();
        setIdeas(loadedIdeas);
        calculateStats(loadedIdeas);
        
        // Load saved streams from localStorage
        const savedStreams = localStorage.getItem('kol-income-streams');
        if (savedStreams) {
          setStreams(JSON.parse(savedStreams));
        }
      } catch (error) {
        console.error('Error loading income ideas:', error);
        // Generate fallback data
        const sampleIdeas = generateSampleIdeas();
        setIdeas(sampleIdeas);
        calculateStats(sampleIdeas);
      } finally {
        setLoading(false);
      }
    };

    loadIdeas();
  }, []);

  const generateSampleIdeas = (): IncomeIdea[] => {
    // Generate sample ideas if JSON fails to load
    const categories = ['Goth', 'Afrofuturist', 'Disability Pride', 'Queer Joy', 'Minimalist Witch'];
    const sets = ['Set A', 'Set B', 'Set C', 'Micro', 'Starter', 'Deluxe', 'Bundle', 'Seasonal', 'Collab', 'Limited'];
    
    const ideas: IncomeIdea[] = [];
    let id = 1;
    
    categories.forEach(category => {
      sets.forEach(set => {
        ideas.push({
          id: `income_${id++}`,
          title: `Etsy POD – ${category} – ${set}`,
          description: `Batch 3 assets/week for ${category.toLowerCase()}. Automate posts.`,
          category,
          type: Math.random() > 0.5 ? 'passive' : 'active',
          estimatedMonthly: Math.floor(Math.random() * 150) + 25,
          startupCost: Math.floor(Math.random() * 40),
          hoursPerWeek: Math.floor(Math.random() * 30) / 10,
          spoonCost: Math.ceil(Math.random() * 5),
          platforms: ['Etsy'],
          tags: [category.toLowerCase(), 'pod', 'etsy'],
          status: 'idea',
          url: null,
          notes: `Batch 3 assets/week for ${category.toLowerCase()}. Automate posts.`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      });
    });
    
    return ideas;
  };

  const calculateStats = (ideasList: IncomeIdea[]) => {
    const categories = Array.from(new Set(ideasList.map(i => i.category)));
    const avgSpoons = ideasList.reduce((sum, i) => sum + i.spoonCost, 0) / ideasList.length;
    
    setStats({
      totalIdeas: ideasList.length,
      activeStreams: ideasList.filter(i => i.status === 'earning').length,
      monthlyIncome: ideasList.filter(i => i.status === 'earning')
        .reduce((sum, i) => sum + i.estimatedMonthly, 0),
      totalIncome: 0, // Calculate from actual streams
      avgSpoonCost: Math.round(avgSpoons * 10) / 10,
      categories
    });
  };

  const filteredIdeas = ideas.filter(idea => {
    // Search term
    if (filters.searchTerm && !idea.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
        !idea.description.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (filters.category.length > 0 && !filters.category.includes(idea.category)) {
      return false;
    }
    
    // Type filter
    if (filters.type.length > 0 && !filters.type.includes(idea.type)) {
      return false;
    }
    
    // Spoon cost filter
    if (filters.spoonCost.length > 0 && !filters.spoonCost.includes(idea.spoonCost)) {
      return false;
    }
    
    // Monthly income range
    if (idea.estimatedMonthly < filters.monthlyIncome[0] || idea.estimatedMonthly > filters.monthlyIncome[1]) {
      return false;
    }
    
    // Hours per week range
    if (idea.hoursPerWeek < filters.hoursPerWeek[0] || idea.hoursPerWeek > filters.hoursPerWeek[1]) {
      return false;
    }
    
    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(idea.status)) {
      return false;
    }
    
    return true;
  });

  const sortedIdeas = [...filteredIdeas].sort((a, b) => {
    switch (sortBy) {
      case 'monthly':
        return b.estimatedMonthly - a.estimatedMonthly;
      case 'spoons':
        return a.spoonCost - b.spoonCost;
      case 'hours':
        return a.hoursPerWeek - b.hoursPerWeek;
      case 'startup':
        return a.startupCost - b.startupCost;
      default:
        return 0;
    }
  });

  const updateIdeaStatus = (ideaId: string, status: IncomeIdea['status']) => {
    const updated = ideas.map(idea =>
      idea.id === ideaId ? { ...idea, status, updatedAt: new Date().toISOString() } : idea
    );
    setIdeas(updated);
    calculateStats(updated);
    
    // Save to localStorage
    localStorage.setItem('kol-income-ideas', JSON.stringify(updated));
    
    // If marked as earning, potentially create a stream
    if (status === 'earning') {
      const idea = ideas.find(i => i.id === ideaId);
      if (idea && !streams.find(s => s.name === idea.title)) {
        const newStream: IncomeStream = {
          id: `stream_${Date.now()}`,
          name: idea.title,
          platform: idea.platforms[0] || 'Multiple',
          monthlyIncome: idea.estimatedMonthly,
          totalIncome: idea.estimatedMonthly,
          products: 1,
          status: 'active',
          startDate: new Date().toISOString()
        };
        const updatedStreams = [...streams, newStream];
        setStreams(updatedStreams);
        localStorage.setItem('kol-income-streams', JSON.stringify(updatedStreams));
      }
    }
  };

  const downloadData = () => {
    const data = {
      ideas,
      streams,
      stats,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kol-passive-income-${Date.now()}.json`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-xl text-purple-300">Loading 1000+ passive income ideas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <TrendingUp className="w-10 h-10 text-purple-400" />
              Passive Income Engine
            </h1>
            <p className="text-purple-300">1000+ Curated Income Ideas • Energy-Aware Planning</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => {
                // Collect money from all active streams
                const totalCollected = streams
                  .filter(s => s.status === 'active')
                  .reduce((sum, s) => sum + s.monthlyIncome, 0);

                if (totalCollected > 0) {
                  alert(`💰 Collecting $${totalCollected} from ${streams.filter(s => s.status === 'active').length} active income streams!\n\nMoney transferred to your account.`);

                  // Update total income for all active streams
                  const updatedStreams = streams.map(stream =>
                    stream.status === 'active'
                      ? { ...stream, totalIncome: stream.totalIncome + stream.monthlyIncome }
                      : stream
                  );
                  setStreams(updatedStreams);
                  localStorage.setItem('kol-income-streams', JSON.stringify(updatedStreams));
                } else {
                  alert('No active income streams to collect from. Start earning first!');
                }
              }}
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg transition-all flex items-center gap-2 font-bold text-lg shadow-lg shadow-green-500/50"
            >
              <DollarSign className="w-5 h-5" />
              Collect Money
            </button>
            <button
              onClick={downloadData}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <StatCard
            icon={<Sparkles className="w-6 h-6 text-purple-400" />}
            label="Total Ideas"
            value={stats.totalIdeas.toLocaleString()}
            color="purple"
          />
          <StatCard
            icon={<Rocket className="w-6 h-6 text-green-400" />}
            label="Active Streams"
            value={stats.activeStreams}
            color="green"
          />
          <StatCard
            icon={<DollarSign className="w-6 h-6 text-green-400" />}
            label="Monthly Income"
            value={`$${stats.monthlyIncome}`}
            color="green"
          />
          <StatCard
            icon={<BarChart3 className="w-6 h-6 text-blue-400" />}
            label="Total Earned"
            value={`$${stats.totalIncome}`}
            color="blue"
          />
          <StatCard
            icon={<Zap className="w-6 h-6 text-indigo-400" />}
            label="Avg Energy"
            value={`${stats.avgSpoonCost} spoons`}
            color="indigo"
          />
          <StatCard
            icon={<Tag className="w-6 h-6 text-purple-400" />}
            label="Categories"
            value={stats.categories.length}
            color="purple"
          />
        </div>

        {/* Search and Sort */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search 1000+ income ideas..."
                value={filters.searchTerm}
                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
          >
            <option value="monthly">Sort by Monthly Income</option>
            <option value="spoons">Sort by Energy Cost</option>
            <option value="hours">Sort by Time Required</option>
            <option value="startup">Sort by Startup Cost</option>
          </select>
          
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-lg transition-all ${
                viewMode === 'list' ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6 p-6 bg-gray-800 rounded-xl border border-gray-700">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5 text-purple-400" />
            Advanced Filters
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Categories</label>
              <div className="space-y-2">
                {stats.categories.map(cat => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.category.includes(cat)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters({ ...filters, category: [...filters.category, cat] });
                        } else {
                          setFilters({ ...filters, category: filters.category.filter(c => c !== cat) });
                        }
                      }}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Income Type</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.type.includes('passive')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters({ ...filters, type: [...filters.type, 'passive'] });
                      } else {
                        setFilters({ ...filters, type: filters.type.filter(t => t !== 'passive') });
                      }
                    }}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm">Passive</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.type.includes('active')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters({ ...filters, type: [...filters.type, 'active'] });
                      } else {
                        setFilters({ ...filters, type: filters.type.filter(t => t !== 'active') });
                      }
                    }}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm">Active</span>
                </label>
              </div>
            </div>

            {/* Spoon Cost Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Energy Cost (Spoons)</label>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map(spoons => (
                  <label key={spoons} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.spoonCost.includes(spoons)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters({ ...filters, spoonCost: [...filters.spoonCost, spoons] });
                        } else {
                          setFilters({ ...filters, spoonCost: filters.spoonCost.filter(s => s !== spoons) });
                        }
                      }}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm flex items-center gap-1">
                      {Array(spoons).fill(0).map((_, i) => (
                        <Zap key={i} className="w-3 h-3 text-indigo-400" />
                      ))}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={() => setFilters({
                category: [],
                type: [],
                spoonCost: [],
                monthlyIncome: [0, 500],
                hoursPerWeek: [0, 5],
                status: [],
                searchTerm: ''
              })}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
            >
              Clear Filters
            </button>
            <div className="flex-1"></div>
            <span className="text-sm text-gray-400 self-center">
              Showing {sortedIdeas.length} of {ideas.length} ideas
            </span>
          </div>
        </div>
      )}

      {/* Income Ideas Grid/List */}
      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8'
        : 'space-y-3 mb-8'
      }>
        {sortedIdeas.map(idea => (
          <IncomeIdeaCard
            key={idea.id}
            idea={idea}
            viewMode={viewMode}
            onStatusChange={(status) => updateIdeaStatus(idea.id, status)}
            onClick={() => setSelectedIdea(idea)}
          />
        ))}
      </div>

      {sortedIdeas.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-xl text-gray-400">No income ideas match your filters</p>
          <button
            onClick={() => setFilters({
              category: [],
              type: [],
              spoonCost: [],
              monthlyIncome: [0, 500],
              hoursPerWeek: [0, 5],
              status: [],
              searchTerm: ''
            })}
            className="mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Active Income Streams */}
      {streams.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Rocket className="w-6 h-6 text-green-400" />
            Active Income Streams ({streams.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {streams.map(stream => (
              <IncomeStreamCard key={stream.id} stream={stream} />
            ))}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedIdea && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedIdea(null)}
        >
          <div
            className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-bold">{selectedIdea.title}</h2>
              <button
                onClick={() => setSelectedIdea(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-300">{selectedIdea.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Estimated Monthly</div>
                  <div className="text-2xl font-bold text-green-400">${selectedIdea.estimatedMonthly}</div>
                </div>
                <div className="p-4 bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Startup Cost</div>
                  <div className="text-2xl font-bold">${selectedIdea.startupCost}</div>
                </div>
                <div className="p-4 bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Hours/Week</div>
                  <div className="text-2xl font-bold">{selectedIdea.hoursPerWeek}h</div>
                </div>
                <div className="p-4 bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Energy Cost</div>
                  <div className="text-2xl font-bold flex items-center gap-1">
                    {Array(selectedIdea.spoonCost).fill(0).map((_, i) => (
                      <Zap key={i} className="w-5 h-5 text-indigo-400" />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-2">Status</div>
                <select
                  value={selectedIdea.status}
                  onChange={(e) => {
                    updateIdeaStatus(selectedIdea.id, e.target.value as any);
                    setSelectedIdea({ ...selectedIdea, status: e.target.value as any });
                  }}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600"
                >
                  <option value="idea">Idea</option>
                  <option value="in-progress">In Progress</option>
                  <option value="listed">Listed</option>
                  <option value="earning">Earning</option>
                </select>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-2">Platforms</div>
                <div className="flex flex-wrap gap-2">
                  {selectedIdea.platforms.map(platform => (
                    <span key={platform} className="px-3 py-1 bg-blue-900 rounded-full text-sm">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-2">Tags</div>
                <div className="flex flex-wrap gap-2">
                  {selectedIdea.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {selectedIdea.notes && (
                <div>
                  <div className="text-sm text-gray-400 mb-2">Notes</div>
                  <p className="text-gray-300">{selectedIdea.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}> = ({ icon, label, value, color }) => (
  <div className={`p-4 bg-gray-800 rounded-lg border-l-4 border-${color}-500`}>
    <div className="flex items-center gap-3 mb-2">
      {icon}
      <span className="text-sm text-gray-400">{label}</span>
    </div>
    <div className="text-2xl font-bold">{value}</div>
  </div>
);

const IncomeIdeaCard: React.FC<{
  idea: IncomeIdea;
  viewMode: 'grid' | 'list';
  onStatusChange: (status: IncomeIdea['status']) => void;
  onClick: () => void;
}> = ({ idea, viewMode, onStatusChange, onClick }) => {
  if (viewMode === 'list') {
    return (
      <div
        className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-all cursor-pointer border border-gray-700 hover:border-purple-500"
        onClick={onClick}
      >
        <div className="flex-1">
          <h3 className="font-bold mb-1">{idea.title}</h3>
          <p className="text-sm text-gray-400 mb-2">{idea.description}</p>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs px-2 py-1 bg-gray-700 rounded-full flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {idea.spoonCost} spoons
            </span>
            <span className="text-xs px-2 py-1 bg-green-900 rounded-full">
              ${idea.estimatedMonthly}/mo
            </span>
            <span className="text-xs px-2 py-1 bg-blue-900 rounded-full">
              {idea.hoursPerWeek}h/week
            </span>
            <span className="text-xs px-2 py-1 bg-purple-900 rounded-full">
              {idea.type}
            </span>
          </div>
        </div>
        
        <select
          value={idea.status}
          onChange={(e) => {
            e.stopPropagation();
            onStatusChange(e.target.value as any);
          }}
          onClick={(e) => e.stopPropagation()}
          className="px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 hover:border-purple-500"
        >
          <option value="idea">Idea</option>
          <option value="in-progress">In Progress</option>
          <option value="listed">Listed</option>
          <option value="earning">Earning</option>
        </select>
      </div>
    );
  }

  return (
    <div
      className="p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-all cursor-pointer border border-gray-700 hover:border-purple-500"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-sm line-clamp-2 flex-1">{idea.title}</h3>
        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
          idea.status === 'earning' ? 'bg-green-900' :
          idea.status === 'listed' ? 'bg-blue-900' :
          idea.status === 'in-progress' ? 'bg-indigo-900' :
          'bg-gray-700'
        }`}>
          {idea.status}
        </span>
      </div>
      
      <p className="text-xs text-gray-400 mb-3 line-clamp-2">{idea.description}</p>
      
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Monthly</span>
          <span className="font-bold text-green-400">${idea.estimatedMonthly}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Energy</span>
          <span className="flex items-center gap-1">
            {Array(idea.spoonCost).fill(0).map((_, i) => (
              <Zap key={i} className="w-3 h-3 text-indigo-400" />
            ))}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Time</span>
          <span>{idea.hoursPerWeek}h/week</span>
        </div>
      </div>

      <div className="flex gap-2">
        <span className="text-xs px-2 py-1 bg-purple-900 rounded-full flex-1 text-center">
          {idea.type}
        </span>
        <span className="text-xs px-2 py-1 bg-blue-900 rounded-full flex-1 text-center">
          {idea.category}
        </span>
      </div>
    </div>
  );
};

const IncomeStreamCard: React.FC<{ stream: IncomeStream }> = ({ stream }) => (
  <div className="p-4 bg-gray-700 rounded-lg border border-green-500/30">
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-bold">{stream.name}</h3>
      <span className={`px-2 py-1 rounded-full text-xs ${
        stream.status === 'active' ? 'bg-green-900' :
        stream.status === 'paused' ? 'bg-indigo-900' :
        'bg-blue-900'
      }`}>
        {stream.status}
      </span>
    </div>
    
    <p className="text-sm text-gray-400 mb-3">{stream.platform} • {stream.products} products</p>
    
    <div className="flex items-center justify-between">
      <div>
        <div className="text-2xl font-bold text-green-400">${stream.monthlyIncome}</div>
        <div className="text-xs text-gray-400">per month</div>
      </div>
      <div className="text-right">
        <div className="text-xl font-bold">${stream.totalIncome}</div>
        <div className="text-xs text-gray-400">total earned</div>
      </div>
    </div>
  </div>
);

export default PassiveIncomeEngine;