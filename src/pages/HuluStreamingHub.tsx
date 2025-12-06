import React, { useState, useEffect } from 'react';
import { Film, TrendingUp, Star, Clock, BookmarkPlus, Search, Sparkles, DollarSign } from 'lucide-react';
import { useHuluStreaming, HuluShow, HuluRecommendation } from '../services/hulu-streaming-service';

/**
 * HULU STREAMING HUB
 * Complete Hulu companion - discover, track, and monetize your viewing
 */

export default function HuluStreamingHub() {
  const {
    watchlist,
    isLoading,
    searchShows,
    addToWatchlist,
    removeFromWatchlist,
    getTrendingShows,
    getRecommendations,
    getViewingAnalytics,
    generateContentIdeas
  } = useHuluStreaming();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<HuluShow[]>([]);
  const [trendingShows, setTrendingShows] = useState<HuluShow[]>([]);
  const [recommendations, setRecommendations] = useState<HuluRecommendation[]>([]);
  const [contentIdeas, setContentIdeas] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'search' | 'trending' | 'recommendations' | 'watchlist' | 'analytics' | 'monetize'>('search');

  useEffect(() => {
    loadTrending();
    loadRecommendations();
    loadAnalytics();
    loadContentIdeas();
  }, []);

  const loadTrending = async () => {
    const trending = await getTrendingShows(20);
    setTrendingShows(trending);
  };

  const loadRecommendations = async () => {
    const recs = await getRecommendations();
    setRecommendations(recs);
  };

  const loadAnalytics = () => {
    const stats = getViewingAnalytics();
    setAnalytics(stats);
  };

  const loadContentIdeas = () => {
    const ideas = generateContentIdeas();
    setContentIdeas(ideas);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    const results = await searchShows(searchQuery);
    setSearchResults(results.shows);
  };

  const handleAddToWatchlist = (show: HuluShow) => {
    addToWatchlist(show);
    loadAnalytics();
    loadContentIdeas();
  };

  const handleRemoveFromWatchlist = (showId: string) => {
    removeFromWatchlist(showId);
    loadAnalytics();
    loadContentIdeas();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-cyan-900 text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Film className="w-12 h-12 text-green-400" />
          <div>
            <h1 className="text-5xl font-bold">Hulu Streaming Hub</h1>
            <p className="text-xl text-gray-300">Discover, Track & Monetize Your Viewing</p>
          </div>
        </div>

        {/* Quick Stats */}
        {analytics && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
              <div className="text-sm text-gray-300">Watchlist</div>
              <div className="text-3xl font-bold">{watchlist.totalCount}</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
              <div className="text-sm text-gray-300">Watch Time</div>
              <div className="text-3xl font-bold">{Math.floor(analytics.totalWatchTime / 3600)}h</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
              <div className="text-sm text-gray-300">Shows Watched</div>
              <div className="text-3xl font-bold">{analytics.showsWatched}</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
              <div className="text-sm text-gray-300">Content Ideas</div>
              <div className="text-3xl font-bold">{contentIdeas.length}</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {(['search', 'trending', 'recommendations', 'watchlist', 'analytics', 'monetize'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-white text-green-900'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Search Tab */}
        {activeTab === 'search' && (
          <div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20 mb-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search for shows, movies, genres..."
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="px-8 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>

            {searchResults.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Search Results ({searchResults.length})</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map(show => (
                    <ShowCard key={show.id} show={show} onAddToWatchlist={handleAddToWatchlist} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Trending Tab */}
        {activeTab === 'trending' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">🔥 Trending Now</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingShows.map(show => (
                <ShowCard key={show.id} show={show} onAddToWatchlist={handleAddToWatchlist} />
              ))}
            </div>
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">✨ Personalized Recommendations</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map(rec => (
                <div key={rec.show.id} className="bg-white/10 backdrop-blur rounded-xl overflow-hidden border border-white/20 hover:border-green-400 transition-all">
                  <ShowCard show={rec.show} onAddToWatchlist={handleAddToWatchlist} />
                  <div className="p-4 border-t border-white/20">
                    <div className="text-sm text-gray-300 mb-2">{rec.reason}</div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                        {Math.round(rec.confidenceScore * 100)}% match
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Watchlist Tab */}
        {activeTab === 'watchlist' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">📚 My Watchlist ({watchlist.totalCount})</h2>
            {watchlist.shows.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {watchlist.shows.map(show => (
                  <ShowCard
                    key={show.id}
                    show={show}
                    onAddToWatchlist={handleAddToWatchlist}
                    onRemove={() => handleRemoveFromWatchlist(show.id)}
                    inWatchlist
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white/10 backdrop-blur rounded-xl border border-white/20">
                <BookmarkPlus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl">Your watchlist is empty</p>
                <p className="text-gray-400 mt-2">Search for shows and add them to your watchlist</p>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && analytics && (
          <div>
            <h2 className="text-2xl font-bold mb-6">📊 Viewing Analytics</h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold mb-4">Favorite Genres</h3>
                <div className="space-y-3">
                  {analytics.favoriteGenres.map((genre: string, index: number) => (
                    <div key={genre} className="flex items-center justify-between">
                      <span>{genre}</span>
                      <div className="h-2 flex-1 mx-4 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-400 to-cyan-400 rounded-full"
                          style={{ width: `${100 - index * 15}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-300">#{index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold mb-4">Watch Stats</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-300">Total Watch Time</div>
                    <div className="text-3xl font-bold">{Math.floor(analytics.totalWatchTime / 3600)} hours</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-300">Shows Watched</div>
                    <div className="text-3xl font-bold">{analytics.showsWatched}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-300">Average Rating</div>
                    <div className="text-3xl font-bold">{analytics.averageRating.toFixed(1)} ⭐</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Monetize Tab */}
        {activeTab === 'monetize' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">💰 Content Monetization Ideas</h2>
            <p className="text-gray-300 mb-6">
              Turn your Hulu viewing into income! Here are {contentIdeas.length} content ideas based on your watchlist:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {contentIdeas.map((idea, index) => (
                <div key={index} className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20 hover:border-green-400 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {idea.type === 'blog' && <Film className="w-5 h-5 text-blue-400" />}
                      {idea.type === 'video' && <Film className="w-5 h-5 text-red-400" />}
                      {idea.type === 'social' && <Sparkles className="w-5 h-5 text-pink-400" />}
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">{idea.type.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-400">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm font-semibold">{(idea.estimatedViews / 1000).toFixed(0)}K views</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold mb-2">{idea.title}</h3>
                  <p className="text-sm text-gray-300 mb-4">{idea.description}</p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Estimated reach: {idea.estimatedViews.toLocaleString()}</span>
                    <button className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition-all">
                      Create Content
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {contentIdeas.length === 0 && (
              <div className="text-center py-12 bg-white/10 backdrop-blur rounded-xl border border-white/20">
                <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl">Add shows to your watchlist to generate content ideas</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Show Card Component
function ShowCard({
  show,
  onAddToWatchlist,
  onRemove,
  inWatchlist
}: {
  show: HuluShow;
  onAddToWatchlist: (show: HuluShow) => void;
  onRemove?: () => void;
  inWatchlist?: boolean;
}) {
  return (
    <div className="bg-white/10 backdrop-blur rounded-xl overflow-hidden border border-white/20 hover:border-green-400 transition-all">
      <div className="aspect-[2/3] bg-gradient-to-br from-green-500/20 to-cyan-500/20 flex items-center justify-center">
        <Film className="w-16 h-16 text-white/50" />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold flex-1">{show.name}</h3>
          <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-sm">
            <Star className="w-4 h-4" />
            {show.rating}
          </div>
        </div>

        <p className="text-sm text-gray-300 mb-3 line-clamp-2">{show.description}</p>

        <div className="flex flex-wrap gap-2 mb-3">
          {show.genres.slice(0, 3).map(genre => (
            <span key={genre} className="text-xs bg-white/20 px-2 py-1 rounded">{genre}</span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm mb-3">
          <span className="text-gray-400">{show.releaseYear}</span>
          {show.type === 'series' && (
            <span className="text-gray-400">{show.seasonCount} seasons</span>
          )}
        </div>

        <div className="flex gap-2">
          {!inWatchlist && (
            <button
              onClick={() => onAddToWatchlist(show)}
              className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
            >
              <BookmarkPlus className="w-4 h-4" />
              Add to Watchlist
            </button>
          )}
          {inWatchlist && onRemove && (
            <button
              onClick={onRemove}
              className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition-all"
            >
              Remove
            </button>
          )}
          <a
            href={show.huluUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-all"
          >
            Watch
          </a>
        </div>
      </div>
    </div>
  );
}
