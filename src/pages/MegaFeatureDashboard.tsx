import React, { useState, useMemo } from 'react';
import { Search, Filter, Star, Zap, Package, TrendingUp, DollarSign, Rocket } from 'lucide-react';
import FeatureRegistry, { FeatureVersion, FeatureCategory, FeaturePlatform } from '../core/FeatureRegistry';

/**
 * MEGA FEATURE DASHBOARD
 * Displays ALL 9,999,999+ features organized by version (V1-V6)
 * Shows implementation status, value, and cross-platform support
 */

export default function MegaFeatureDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVersion, setSelectedVersion] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [showImplementedOnly, setShowImplementedOnly] = useState(false);

  // Get feature stats
  const stats = useMemo(() => FeatureRegistry.getStats(), []);

  // Get filtered features
  const features = useMemo(() => {
    let filtered = FeatureRegistry.getAllFeatures();

    if (searchQuery) {
      filtered = filtered.filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedVersion !== 'all') {
      filtered = filtered.filter(f => f.version === selectedVersion);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(f => f.category === selectedCategory);
    }

    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(f =>
        f.platforms.includes(selectedPlatform as FeaturePlatform) ||
        f.platforms.includes(FeaturePlatform.ALL)
      );
    }

    if (showImplementedOnly) {
      filtered = filtered.filter(f => f.implemented);
    }

    return filtered.sort((a, b) => {
      // Sort by priority first, then by value
      if (a.priority !== b.priority) return a.priority - b.priority;
      return b.estimatedValue - a.estimatedValue;
    });
  }, [searchQuery, selectedVersion, selectedCategory, selectedPlatform, showImplementedOnly]);

  // Calculate filtered stats
  const filteredStats = useMemo(() => {
    const implemented = features.filter(f => f.implemented);
    return {
      total: features.length,
      implemented: implemented.length,
      planned: features.length - implemented.length,
      totalValue: features.reduce((sum, f) => sum + f.estimatedValue, 0),
      implementedValue: implemented.reduce((sum, f) => sum + f.estimatedValue, 0)
    };
  }, [features]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Package className="w-12 h-12 text-yellow-400" />
          <div>
            <h1 className="text-5xl font-bold">Mega Feature Dashboard</h1>
            <p className="text-xl text-gray-300">
              All {stats.total.toLocaleString()}+ Features • V1-V6 • Web, Mobile, Desktop
            </p>
          </div>
        </div>
      </div>

      {/* Global Stats */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard
            icon={<Package />}
            label="Total Features"
            value={stats.total.toLocaleString()}
            color="from-blue-500 to-cyan-500"
          />
          <StatCard
            icon={<Zap />}
            label="Implemented"
            value={stats.implemented.toLocaleString()}
            color="from-green-500 to-emerald-500"
          />
          <StatCard
            icon={<Rocket />}
            label="Planned"
            value={stats.planned.toLocaleString()}
            color="from-yellow-500 to-orange-500"
          />
          <StatCard
            icon={<DollarSign />}
            label="Total Value"
            value={`$${(stats.totalValue / 1000000).toFixed(1)}M`}
            color="from-purple-500 to-pink-500"
          />
          <StatCard
            icon={<Star />}
            label="Implemented Value"
            value={`$${(stats.implementedValue / 1000).toFixed(0)}K`}
            color="from-green-500 to-teal-500"
          />
          <StatCard
            icon={<TrendingUp />}
            label="Completion"
            value={`${((stats.implemented / stats.total) * 100).toFixed(1)}%`}
            color="from-indigo-500 to-purple-500"
          />
        </div>
      </div>

      {/* Version Stats */}
      <div className="max-w-7xl mx-auto mb-8">
        <h2 className="text-2xl font-bold mb-4">Features by Version</h2>
        <div className="grid grid-cols-6 gap-4">
          {Object.entries(stats.byVersion).map(([version, count]) => (
            <div
              key={version}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                selectedVersion === version
                  ? 'bg-white/20 border-white'
                  : 'bg-white/5 border-white/20 hover:bg-white/10'
              }`}
              onClick={() => setSelectedVersion(selectedVersion === version ? 'all' : version)}
            >
              <div className="text-3xl font-bold text-center mb-2">{version.toUpperCase()}</div>
              <div className="text-center text-gray-300">{count.toLocaleString()} features</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search features..."
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="all">All Categories</option>
              {Object.values(FeatureCategory).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Platform Filter */}
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="all">All Platforms</option>
              <option value="web">Web</option>
              <option value="mobile">Mobile</option>
              <option value="desktop">Desktop</option>
            </select>

            {/* Status Filter */}
            <label className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 border border-white/20 cursor-pointer hover:bg-white/20 transition-all">
              <input
                type="checkbox"
                checked={showImplementedOnly}
                onChange={(e) => setShowImplementedOnly(e.target.checked)}
                className="w-5 h-5"
              />
              <span>Implemented Only</span>
            </label>
          </div>

          {/* Filtered Stats */}
          <div className="grid grid-cols-5 gap-4 pt-4 border-t border-white/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{filteredStats.total.toLocaleString()}</div>
              <div className="text-sm text-gray-300">Matching</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{filteredStats.implemented.toLocaleString()}</div>
              <div className="text-sm text-gray-300">Implemented</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{filteredStats.planned.toLocaleString()}</div>
              <div className="text-sm text-gray-300">Planned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">${(filteredStats.totalValue / 1000).toFixed(0)}K</div>
              <div className="text-sm text-gray-300">Total Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-400">
                {filteredStats.total > 0 ? ((filteredStats.implemented / filteredStats.total) * 100).toFixed(1) : 0}%
              </div>
              <div className="text-sm text-gray-300">Complete</div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.slice(0, 100).map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>

        {features.length > 100 && (
          <div className="text-center mt-8 p-6 bg-white/10 backdrop-blur rounded-xl border border-white/20">
            <p className="text-xl mb-2">
              Showing 100 of {features.length.toLocaleString()} features
            </p>
            <p className="text-gray-300">
              Refine your search to see specific features
            </p>
          </div>
        )}

        {features.length === 0 && (
          <div className="text-center p-12 bg-white/10 backdrop-blur rounded-xl border border-white/20">
            <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl">No features match your filters</p>
            <p className="text-gray-300 mt-2">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, label, value, color }: any) {
  return (
    <div className={`p-6 rounded-xl bg-gradient-to-r ${color} border border-white/20 shadow-2xl`}>
      <div className="flex items-center gap-3 mb-2">
        {React.cloneElement(icon, { className: 'w-6 h-6' })}
        <div className="text-sm opacity-90">{label}</div>
      </div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ feature }: { feature: any }) {
  const versionColors = {
    v1: 'from-blue-500 to-cyan-500',
    v2: 'from-green-500 to-emerald-500',
    v3: 'from-yellow-500 to-orange-500',
    v4: 'from-purple-500 to-pink-500',
    v5: 'from-red-500 to-rose-500',
    v6: 'from-indigo-500 to-violet-500'
  };

  const statusColors = {
    active: 'text-green-400',
    beta: 'text-yellow-400',
    planned: 'text-blue-400',
    deprecated: 'text-red-400'
  };

  return (
    <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all hover:transform hover:scale-105">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className={`px-3 py-1 rounded-lg bg-gradient-to-r ${versionColors[feature.version]} text-sm font-bold`}>
          {feature.version.toUpperCase()}
        </div>
        <div className="flex gap-2">
          {feature.implemented && <Zap className="w-5 h-5 text-green-400" />}
          {feature.priority === 1 && <Star className="w-5 h-5 text-yellow-400" />}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold mb-2">{feature.name}</h3>

      {/* Description */}
      <p className="text-sm text-gray-300 mb-4 line-clamp-2">{feature.description}</p>

      {/* Category & Status */}
      <div className="flex gap-2 mb-3">
        <span className="px-2 py-1 bg-purple-500/30 rounded text-xs">{feature.category}</span>
        <span className={`px-2 py-1 rounded text-xs ${statusColors[feature.status]}`}>
          {feature.status}
        </span>
      </div>

      {/* Platforms */}
      <div className="flex gap-2 mb-3">
        {feature.platforms.map((platform: string) => (
          <span key={platform} className="px-2 py-1 bg-blue-500/30 rounded text-xs">
            {platform}
          </span>
        ))}
      </div>

      {/* Value */}
      <div className="flex items-center justify-between pt-3 border-t border-white/20">
        <div className="text-sm text-gray-300">Est. Value:</div>
        <div className="text-lg font-bold text-green-400">${feature.estimatedValue.toLocaleString()}</div>
      </div>

      {/* APIs */}
      {feature.apis && feature.apis.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/20">
          <div className="text-xs text-gray-400 mb-2">APIs:</div>
          <div className="flex flex-wrap gap-1">
            {feature.apis.map((api: string) => (
              <span key={api} className="px-2 py-1 bg-cyan-500/20 rounded text-xs">
                {api}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
